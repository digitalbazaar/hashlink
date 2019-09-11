/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import * as cbor from 'borc';
import {TextDecoder, stringToUint8Array} from './util.js';

export class Hashlink {
  /**
   * Encodes a new Hashlink instance that can be used to encode or decode
   * data at URLs.
   *
   * @returns {Hashlink} A Hashlink used to encode and decode cryptographic
   *   hyperlinks.
   */
  constructor() {
    this.registeredCodecs = {};
  }

  /**
   * Encodes a hashlink. If only a `url` parameter is provided, the URL is
   * fetched, transformed, and encoded into a hashlink. If a data parameter
   * is provided, the hashlink is encoded from the data.
   *
   * @param {Object} options - The options for the encode operation.
   * @param {Uint8Array} [options.data] - The data associated with the given
   *   URL. If provided, this data is used to encode the cryptographic hash.
   * @param {Array} options.codecs - One or more codecs that should be used
   *   to encode the data.
   * @param {Array} [options.urls] - One or more URLs that contain the data
   *   referred to by the hashlink.
   * @param {Object} [options.meta] - A set of key-value metadata that will be
   *   encoded into the hashlink.
   *
   * @returns {Promise<string>} Resolves to a string that is a hashlink.
   */
  async encode({data, urls, codecs, meta = {}}) {
    // ensure data or urls are provided
    if(data === undefined && urls === undefined) {
      throw new Error('Either `data` or `urls` must be provided.');
    }

    // ensure codecs are provided
    if(codecs === undefined) {
      throw new Error('The hashlink creation `codecs` must be provided.');
    }

    if(urls !== undefined) {
      // ensure urls are an array
      if(!Array.isArray(urls)) {
        urls = [urls];
      }

      // ensure all URLs are strings
      urls.forEach(url => {
        if(typeof url !== 'string') {
          throw new Error(`URL "${url}" must be a string.`);
        }
      });

      // merge meta options with urls
      meta = {...meta, url: urls};
    }

    // generate the encoded cryptographic hash
    const outputData = await codecs.reduce(async (output, codec) => {
      const encoder = this.registeredCodecs[codec];
      if(encoder === undefined) {
        throw new Error(`Unknown cryptographic hash encoder "${encoder}".`);
      }

      return encoder.encode(await output);
    }, data);

    // generate the encoded metadata
    const metadata = new Map();
    if(meta.url) {
      metadata.set(0x0f, meta.url);
    }
    if(meta['content-type']) {
      metadata.set(0x0e, meta['content-type']);
    }
    if(meta.experimental) {
      metadata.set(0x0d, meta.experimental);
    }
    if(meta.transform) {
      metadata.set(0x0c, meta.transform);
    }

    // build the hashlink
    const textDecoder = new TextDecoder();
    let hashlink = 'hl:' + textDecoder.decode(outputData);

    // append meta data if present
    if(metadata.size > 0) {
      const baseEncodingCodec = codecs[codecs.length - 1];
      const cborData = new Uint8Array(cbor.encode(metadata));
      const mbCborData = textDecoder.decode(
        this.registeredCodecs[baseEncodingCodec].encode(cborData));
      hashlink += ':' + mbCborData;
    }

    return hashlink;
  }

  /**
   * Decodes a hashlink resulting in an object with key-value pairs
   * representing the values encoded in the hashlink.
   *
   * @param {Object} options - The options for the encode operation.
   * @param {string} options.hashlink - The encoded hashlink value to decode.
   *
   * @returns {Object} Returns an object with the decoded hashlink values.
   */
  decode({hashlink}) {
    throw new Error('Not implemented.');
  }

  /**
   * Verifies a hashlink resulting in a simple true or false value.
   *
   * @param {Object} options - The options for the encode operation.
   * @param {string} options.hashlink - The encoded hashlink value to verify.
   * @param {string} options.data - The data to use for the hashlink.
   * @param {Array} options.resolvers - An array of Objects with key-value
   *   pairs. Each object must contain a `scheme` key associated with a
   *   Function({url, options}) that resolves any URL with the given scheme
   *   and options to data.
   *
   * @returns {Promise<boolean>} true if the hashlink is valid, false otherwise.
   */
  async verify({data, hashlink, resolvers}) {
    const components = hashlink.split(':');

    if(components.length > 3) {
      throw new Error(`Hashlink "${hashlink}" is invalid; ` +
        'it contains more than two colons.');
    }

    // determine the base encoding decoder and decode the multihash value
    const multibaseEncodedMultihash = stringToUint8Array(components[1]);
    const multibaseDecoder = this._findDecoder(multibaseEncodedMultihash);
    const encodedMultihash = multibaseDecoder.decode(multibaseEncodedMultihash);

    // determine the multihash decoder
    const multihashDecoder = this._findDecoder(encodedMultihash);

    // extract the metadata to discover extra codecs
    const codecs = [];
    if(components.length === 3) {
      const encodedMeta = stringToUint8Array(components[2]);
      const cborMeta = multibaseDecoder.decode(encodedMeta);
      const meta = cbor.decode(cborMeta);
      // extract transforms if they exist
      if(meta.has(0x0c)) {
        codecs.push(...meta.get(0x0c));
      }
    }

    // generate the complete list of codecs
    codecs.push(multihashDecoder.algorithm, multibaseDecoder.algorithm);

    // generate the hashlink
    const generatedHashlink = await this.encode({data, codecs});
    const generatedComponents = generatedHashlink.split(':');

    // check to see if the encoded hashes match
    return components[1] === generatedComponents[1];
  }

  /**
   * Extends the Hashlink instance such that it can support new codecs
   * such as new cryptographic hashing, base-encoding, and resolution
   * mechanisms.
   *
   * @param {Codec} codec - A Codec instance that has a .encode()
   *   and a .decode() method. It must also have an `identifier` and
   *   `algorithm` property.
   */
  use(codec) {
    this.registeredCodecs[codec.algorithm] = codec;
  }

  /**
   * Finds a registered decoder for a given set of bytes or throws an Error.
   *
   * @param {Uint8Array} bytes - A stream of bytes to use when matching against
   *   the registered decoders.
   * @returns A registered decoder that can be used to encode/decode the byte
   *   stream.
   */
  _findDecoder(bytes) {
    const decoders = Object.values(this.registeredCodecs);
    const decoder = decoders.find(
      decoder => decoder.identifier.every((id, i) => id === bytes[i]));
    if(!decoder) {
      throw new Error('Could not determine decoder for: ' + bytes);
    }
    return decoder;
  }
}
