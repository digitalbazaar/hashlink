/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import * as defaultCodecs from './codecs.js';
import {Hashlink} from './Hashlink.js';

// setup exports for this module
export {Hashlink} from './Hashlink.js';
export {
  encode,
  decode,
  verify,
};

// setup the default encoder/decoder
const hlDefault = new Hashlink();
hlDefault.use(new defaultCodecs.MultihashSha2256());
hlDefault.use(new defaultCodecs.MultihashBlake2b64());
hlDefault.use(new defaultCodecs.MultibaseBase58btc());

const DEFAULT_CODEC_IDS = ['mh-sha2-256', 'mb-base58-btc'];

/**
 * Encodes a hashlink. If only a `url` parameter is provided, the URL is
 * fetched, transformed, and encoded into a hashlink. If a data parameter
 * is provided, the hashlink is encoded from the data.
 *
 * @param {Uint8Array} data - The data associated with the given URL. If
 *   provided, this data is used to encode the cryptographic hash.
 * @param {string|Array} url - One or more URLs that resolve to the data
 *   referred to by the hashlink.
 * @param {Array} [codecs] - One or more URLs that contain the data
 *   referred to by the hashlink.
 * @param {object} [meta={}] - A set of key-value metadata that will be
 *   encoded into the hashlink.
 *
 * @returns {Promise<string>} Resolves to a string that is a hashlink.
 */
async function encode(options) {
  let data, urls, url, codecs, meta;

  if(!options) {
    throw new Error('Urls and/or data params are required.');
  }

  if(typeof options === 'string') { // Convenience usage, `create(url)`
    url = options;
    codecs = DEFAULT_CODEC_IDS;
    meta = {};
  } else {
    data = options.data;
    urls = options.urls;
    url = options.url;
    codecs = options.codecs || DEFAULT_CODEC_IDS;
    meta = options.meta || {};
  }

  if(url && !urls) {
    urls = [url];
  }

  if(!data) {
    // TODO: Add fetching of data from url
    throw new Error('Fetching of data from urls coming soon.');
  }

  return hlDefault.encode({data, urls, codecs, meta});
}

/**
 * Decodes a hashlink resulting in an object with key-value pairs
 * representing the values encoded in the hashlink.
 *
 * @param {string} hashlink - The encoded hashlink value to decode.
 *
 * @returns {object} Returns an object with the decoded hashlink values.
 */
function decode({hashlink}) {
  throw new Error('Not implemented.');
}

/**
 * Verifies a hashlink resulting in a simple true or false value.
 *
 * @param {string} hashlink - The encoded hashlink value to verify.
 * @param {Uint8Array} data - Optional data to use when verifying
 *   hashlink.
 * @param {Array<object>} [resolvers] - An array of Objects with key-value
 *   pairs. Each object must contain a `scheme` key associated with a
 *   Function({url, options}) that resolves any URL with the given scheme
 *   and options to data.
 *
 * @returns {Promise<boolean>} true if the hashlink is valid, false otherwise.
 */
async function verify({hashlink, data, resolvers}) {
  if(!data) {
    // TODO: Add fetching of data from url
    throw new Error('Fetching of data from hashlink coming soon.');
  }

  return hlDefault.verify({hashlink, data, resolvers});
}
