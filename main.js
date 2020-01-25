/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

//import * as base58 from 'base58-universal';
//import crypto from './crypto.js';
import * as defaultCodecs from './codecs.js';
import {Hashlink} from './Hashlink.js';
//import {stringToUint8Array} from './util.js';

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

/**
 * Encodes a hashlink. If only a `url` parameter is provided, the URL is
 * fetched, transformed, and encoded into a hashlink. If a data parameter
 * is provided, the hashlink is encoded from the data.
 *
 * @param {Object} options - The options for the encode operation.
 * @param {Uint8Array} options.data - The data associated with the given URL. If
 *   provided, this data is used to encode the cryptographic hash.
 * @param {Array} options.urls - One or more URLs that contain the data
 *   referred to by the hashlink.
 * @param {Array} options.codecs - One or more URLs that contain the data
 *   referred to by the hashlink.
 * @param {Object} options.meta - A set of key-value metadata that will be
 *   encoded into the hashlink.
 *
 * @returns {Promise<string>} Resolves to a string that is a hashlink.
 */
async function encode({data, urls, url,
  codecs = ['mh-sha2-256', 'mb-base58-btc'], meta = {}}) {

  if(url && !urls) {
    urls = [url];
  }

  return await hlDefault.encode({data, urls, codecs, meta});
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
function decode({hashlink}) {
  throw new Error('Not implemented.');
}

/**
 * Verifies a hashlink resulting in a simple true or false value.
 *
 * @param {Object} options - The options for the encode operation.
 * @param {string} options.hashlink - The encoded hashlink value to verify.
 * @param {Uint8Array} options.data - Optional data to use when verifying
 *   hashlink.
 * @param {Array} options.resolvers - An array of Objects with key-value
 *   pairs. Each object must contain a `scheme` key associated with a
 *   Function({url, options}) that resolves any URL with the given scheme
 *   and options to data.
 *
 * @returns {Promise<boolean>} true if the hashlink is valid, false otherwise.
 */
async function verify({hashlink, data, resolvers}) {
  return hlDefault.verify({hashlink, data, resolvers});
}
