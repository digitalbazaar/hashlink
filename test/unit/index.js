/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const chai = require('chai');
const {Hashlink} = require('../../');
const hl = require('../../');
const {stringToUint8Array} = require('../../util.js');
const transforms = require('../../transforms.js');

chai.should();

describe('hashlink', function() {
  // setup test data
  const testData = stringToUint8Array('Hello World!');
  const exampleUrl = 'https://example.com/hw.txt';

  describe(`Hashlink`, function() {
    describe(`create API`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use('mh-sha2-256', transforms.multihashSha2256);
      hlInstance.use('mb-base58-btc', transforms.multibaseBase58btc);

      it('create({data, transforms}) should create a hashlink', async function() {
        const result = await hlInstance.create({
          data: testData,
          transforms: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal('hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e');
      });

      it('create({data, urls, transforms}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          transforms: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('create({data, urls, meta, transforms}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain'
          },
          transforms: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });
  });

  describe(`convenience functionality`, function() {
    describe(`create API`, function() {

      it('create({data}) should create a hashlink', async function() {
        const result = await hl.create({
          data: testData
        });

        result.should.equal('hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e');
      });

      it('create({data, urls}) should create a hashlink',
        async function() {
        const result = await hl.create({
          data: testData,
          urls: [exampleUrl]
        });

        result.should.equal(
          'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('create({data, urls, meta}) should create a hashlink',
        async function() {
        const result = await hl.create({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain'
          }
        });

        result.should.equal(
          'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });
  });
});
