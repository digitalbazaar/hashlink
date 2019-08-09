/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

export {Hashlink} from './Hashlink.js';
export {
  create,
  decode,
  verify,
};

// setup the default encoder/decoder
const hlDefault = new Hashlink();
hlDefault.use('sha2-256', _transformSha2256);
hlDefault.use('multibase-base58btc', _transformMultibaseBase58btc);

/**
 * Creates a hashlink. If only a `url` parameter is provided, the URL is
 * fetched, transformed, and encoded into a hashlink. If a data parameter
 * is provided, the hashlink is created from the data.
 *
 * @param {Object} options - The options for the create operation.
 * @param {Uint8Array} options.data - The data associated with the given URL. If
 *   provided, this data is used to create the cryptographic hash.
 * @param {Array} options.urls - One or more URLs that contain the data
 *   referred to by the hashlink.
 * @param {Array} options.transforms - One or more URLs that contain the data
 *   referred to by the hashlink.
 * @param {Object} options.meta - A set of key-value metadata that will be
 *   encoded into the hashlink.
 *
 * @returns {Promise<string>} Resolves to a string that is a hashlink.
 */
async function create({data, urls,
  transforms = ['sha2-256', 'multibase-base58btc'], meta = {}}) {

  if(data === undefined && urls == undefined) {
    throw new Error('Either `data` or `urls` must be provided.')
  }

  return await hlDefault.create({data, urls, transforms, meta});
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
function decode({hashlink}) {
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
async function verify({hashlink, resolvers}) {
  throw new Error('Not implemented.');
}

/**
 * Transform function that takes a Uint8Array as input and performs a SHA-2
 * cryptographic hash on the data and outputs a 256-bit value.
 *
 * @param {Uint8Array} input - The input for the transformation function.
 *
 * @returns {Uint8Array} the output of the transformation function.
 */
function _transformSha2256(input) {
  return crypto.subtle.digest({name: 'SHA-256'}, input.buffer);
}

/**
 * Transform function that takes a Uint8Array as input and performs a multibase
 * base58btc encoding on the data.
 *
 * @param {Uint8Array} input - The input for the transformation function.
 *
 * @returns {Uint8Array} the output of the transformation function.
 */
function _transformMultibaseBase58btc(input) {
  return 'z' + input;
}
