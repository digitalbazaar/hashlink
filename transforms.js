/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const base58 = require('./base58');
const blake2b = require('blakejs').blake2b;
import crypto from './crypto.js';
const {stringToUint8Array} = require('./util');

export {
  multihashSha2256,
  multihashBlake2b64,
  multibaseBase58btc
};

/**
 * Transform function that takes a Uint8Array as input and performs a SHA-2
 * cryptographic hash on the data and outputs a multihash-encoded value.
 *
 * @param {Uint8Array} input - The input for the transformation function.
 *
 * @returns {Uint8Array} the output of the transformation function.
 */
async function multihashSha2256(input) {
  const sha2256 = new Uint8Array(
    await crypto.subtle.digest({name: 'SHA-256'}, input));
  const mhsha2256 = new Uint8Array(sha2256.byteLength + 2);

  mhsha2256[0] = 0x12; // multihash sha2 256-bits
  mhsha2256[1] = 0x20; // multihash 32 byte length
  mhsha2256.set(sha2256, 2);

  return mhsha2256;
}

/**
 * Transform function that takes a Uint8Array as input and performs a blake2b
 * cryptographic hash on the data and outputs a multihash-encoded value.
 *
 * @param {Uint8Array} input - The input for the transformation function.
 *
 * @returns {Uint8Array} the output of the transformation function.
 */
async function multihashBlake2b64(input) {
  const blake2b64 = blake2b(input, null, 8);
  const mhblake2b64 = new Uint8Array(blake2b64.byteLength + 3);

  mhblake2b64[0] = 0xb2; // multihash blake2b
  mhblake2b64[1] = 0x08; // multihash blake2b - 64-bits
  mhblake2b64[2] = 0x08; // multihash 8 byte length
  mhblake2b64.set(blake2b64, 3);

  return mhblake2b64;
}

/**
 * Transform function that takes a Uint8Array as input and performs a multibase
 * base58btc encoding on the data.
 *
 * @param {Uint8Array} input - The input for the transformation function.
 *
 * @returns {Uint8Array} the output of the transformation function.
 */
function multibaseBase58btc(input) {
  return new Uint8Array(stringToUint8Array('z' + base58.encode(input)));
}
