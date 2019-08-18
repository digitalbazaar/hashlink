/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const cbor = require('borc');
import {TextDecoder, stringToUint8Array} from './util.js';

export class Hashlink {
  /**
   * Creates a new Hashlink instance that can be used to encode or decode
   * data at URLs.
   *
   * @returns {Hashlink} A Hashlink used to encode and decode cryptographic
   *   hyperlinks.
   */
  constructor() {
    this.registeredTransforms = {};
  }

  /**
   * Creates a hashlink. If only a `url` parameter is provided, the URL is
   * fetched, transformed, and encoded into a hashlink. If a data parameter
   * is provided, the hashlink is created from the data.
   *
   * @param {Object} options - The options for the create operation.
   * @param {Uint8Array} [options.data] - The data associated with the given URL.
   *   If provided, this data is used to create the cryptographic hash.
   * @param {Array} options.urls - One or more URLs that contain the data
   *   referred to by the hashlink.
   * @param {Array} options.transforms - One or more URLs that contain the data
   *   referred to by the hashlink.
   * @param {Object} options.meta - A set of key-value metadata that will be
   *   encoded into the hashlink.
   *
   * @returns {Promise<string>} Resolves to a string that is a hashlink.
   */
  async create({data, urls, transforms, meta = {}}) {
    // ensure data or urls are provided
    if(data === undefined && urls == undefined) {
      throw new Error('Either `data` or `urls` must be provided.')
    }

    // transforms are provided
    if(transforms === undefined) {
      throw new Error('The hashlink creation `transforms` must be provided.')
    }

    if(urls) {
      // ensure urls are an array
      if(!Array.isArray(urls)) {
        urls = [urls];
      }

      // ensure all URLs are strings
      urls.forEach(url => {
        if(typeof url !== 'string') {
          throw new Error(`Url "${url}" must be a string.`);
        }
      });
    }

    // merge meta options with urls
    meta = {...meta, url: urls};

    // generate the encoded cryptographic hash
    const outputData = await transforms.reduce(
      async (transformedData, transform) => {
      transformedData = await transformedData;
      transformedData = await this.registeredTransforms[transform].encode(
        transformedData);
      return transformedData;
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
    let mhMeta = '';
    if(metadata.size > 0) {
      const baseEncodingTransform = transforms[transforms.length - 1];
      const cborData = new Uint8Array(cbor.encode(metadata));
      const mbCborData = new TextDecoder().decode(
        this.registeredTransforms[baseEncodingTransform].encode(cborData));

      mhMeta = ':' + mbCborData;
    }

    return 'hl:' + new TextDecoder().decode(outputData) + mhMeta;
  }

  /**
   * Decodes a hashlink resulting in an object with key-value pairs
   * representing the values encoded in the hashlink.
   *
   * @param {Object} options - The options for the create operation.
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
   * @param {Object} options - The options for the create operation.
   * @param {string} options.hashlink - The encoded hashlink value to verify.
   * @param {Array} options.resolvers - An array of Objects with key-value
   *   pairs. Each object must contain a `scheme` key associated with a
   *   Function({url, options}) that resolves any URL with the given scheme
   *   and options to data.
   *
   * @returns {Promise<boolean>} true if the hashlink is valid, false otherwise.
   */
  async verify({hashlink, resolvers}) {
    throw new Error('Not implemented.');
  }

  /**
   * Extends the Hashlink instance such that it can support new transformation
   * mechanisms such as new cryptographic hashing, base-encoding, and
   * resolution mechanisms.
   *
   * @param {Transform} transform - A Transform class that has a .encode()
   *   and a .decode() method. It must also have an ```identifier``` and
   *   ```algorithm``` property.
   */
  use(transform) {
    this.registeredTransforms[transform.algorithm] = transform;
  }

}
