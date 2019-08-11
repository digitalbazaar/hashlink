/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const base58 = require('./base58');
import crypto from './crypto.js';
const {stringToUint8Array} = require('./util');

export {
  multihashSha2256,
  multibaseBase58btc
};

/**
 * Transform function that takes a Uint8Array as input and performs a SHA-2
 * cryptographic hash on the data and outputs a 256-bit value.
 *
 * @param {Uint8Array} input - The input for the transformation function.
 *
 * @returns {Uint8Array} the output of the transformation function.
 */
async function multihashSha2256(input) {
  const sha2256 = new Uint8Array(
    await crypto.subtle.digest({name: 'SHA-256'}, input));
  const mhsha2256 = new Uint8Array(sha2256.byteLength + 2);

  mhsha2256[0] = 0x12; // multihash sha2-256: 0x12
  mhsha2256[1] = 0x20; // multihash 32 bytes: 0x20
  mhsha2256.set(sha2256, 2);

  return mhsha2256;
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
