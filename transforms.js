/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const base58 = require('./base58');
const blake2b = require('blakejs').blake2b;
import crypto from './crypto.js';
const {stringToUint8Array} = require('./util');

export {
  MultihashSha2256,
  MultihashBlake2b64,
  MultibaseBase58btc
};

class MultihashSha2256 {
  /**
   * Creates a new MultihashSha2256 data transformer.
   *
   * @returns {MultihashSha2256} A MultihashSha2256 used to encode and decode
   *   Multihash SHA-2 256-bit values.
   */
  constructor() {
    this.identifier = new Uint8Array([0x12, 0x20]);
    this.algorithm = 'mh-sha2-256';
  }

  /**
   * Encoder that takes a Uint8Array as input and performs a SHA-2
   * cryptographic hash on the data and outputs a multihash-encoded value.
   *
   * @param {Uint8Array} input - The input for the transformation function.
   *
   * @returns {Uint8Array} the output of the transformation function.
   */
  async encode(input) {
    const sha2256 = new Uint8Array(
      await crypto.subtle.digest({name: 'SHA-256'}, input));
    const mhsha2256 = new Uint8Array(
      sha2256.byteLength + this.identifier.byteLength);

    mhsha2256.set(this.identifier, 0);
    mhsha2256.set(sha2256, this.identifier.byteLength);

    return mhsha2256;
  }
}

class MultihashBlake2b64 {
  /**
   * Creates a new MultihashBlake2b64 data transformer.
   *
   * @returns {MultihashBlake2b32} A MultihashBlake2b64 used to encode and
   *   decode Multihash Blake2b 64-bit values.
   */
  constructor() {
    this.identifier = new Uint8Array([0xb2, 0x08, 0x08]);
    this.algorithm = 'mh-blake2b-64';
  }

  /**
   * Encoder function that takes a Uint8Array as input and performs a blake2b
   * cryptographic hash on the data and outputs a multihash-encoded value.
   *
   * @param {Uint8Array} input - The input for the transformation function.
   *
   * @returns {Uint8Array} the output of the transformation function.
   */
  async encode(input) {
    const blake2b64 = blake2b(input, null, 8);
    const mhblake2b64 = new Uint8Array(
      blake2b64.byteLength + this.identifier.byteLength);

    mhblake2b64.set(this.identifier, 0);
    mhblake2b64.set(blake2b64, this.identifier.byteLength);

    return mhblake2b64;
  }
}

class MultibaseBase58btc {
  /**
   * Creates a new MultibaseBase58btc data transformer.
   *
   * @returns {MultibaseBase58btc} A MultibaseBase58btc used to encode and
   *   decode Multibase base58btc values.
   */
  constructor() {
    this.identifier = new Uint8Array([0x7a]);
    this.algorithm = 'mb-base58-btc';
  }

  /**
   * Encoder function that takes a Uint8Array as input and performs a multibase
   * base58btc encoding on the data.
   *
   * @param {Uint8Array} input - The input for the transformation function.
   *
   * @returns {Uint8Array} the output of the transformation function.
   */
  encode(input) {
    return new Uint8Array(stringToUint8Array('z' + base58.encode(input)));
  }
}
