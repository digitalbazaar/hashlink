/**
 * Hashlinker.
 *
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const api = module.exports = {};

/**
 * Encode a hashlink.
 */
api.encode = function({
  // some options are mutually exclusive
  content,
  hash,
  urls,
  salt,
  saltLength = 16,
  contentType,
  extensions,
  multihashFormat = 'sha2-256',
  multibaseFormat = 'base58btc'
}) {
  throw new Error('Not implemented');
};

/**
 * Decode a hashlink.
 */
api.decode = function({
  hashlink,
  format = 'json-ld'
}) {
  throw new Error('Not implemented');
};
