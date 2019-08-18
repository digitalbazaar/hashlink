/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const chai = require('chai');
const {Hashlink} = require('../../');
const hl = require('../../');
const jsonld = require('jsonld');
const {stringToUint8Array, TextDecoder} = require('../../util.js');
const transforms = require('../../transforms.js');

chai.should();

describe('hashlink library', function() {
  // setup test data
  const testData = stringToUint8Array('Hello World!');
  const exampleUrl = 'https://example.com/hw.txt';

  describe(`Hashlink class`, function() {
    describe(`create() [sha2-256]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new transforms.MultihashSha2256());
      hlInstance.use(new transforms.MultibaseBase58btc());

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

    describe(`create API (blake2b-64)`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new transforms.MultihashBlake2b64());
      hlInstance.use(new transforms.MultibaseBase58btc());

      it('create({data, transforms}) should create a hashlink', async function() {
        const result = await hlInstance.create({
          data: testData,
          transforms: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal('hl:zm9YZiJ7LARpE6oz');
      });

      it('create({data, urls, transforms}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          transforms: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZiJ7LARpE6oz:' +
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
          transforms: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZiJ7LARpE6oz:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`create() [blake2b-64]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new transforms.MultihashBlake2b64());
      hlInstance.use(new transforms.MultibaseBase58btc());

      it('create({data, transforms}) should create a hashlink', async function() {
        const result = await hlInstance.create({
          data: testData,
          transforms: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal('hl:zm9YZiJ7LARpE6oz');
      });

      it('create({data, urls, transforms}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          transforms: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZiJ7LARpE6oz:' +
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
          transforms: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZiJ7LARpE6oz:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`verify() [sha2-256]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new transforms.MultihashSha2256());
      hlInstance.use(new transforms.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hlInstance.verify({
          data: testData,
          hashlink: 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`verify() [blake2b-64]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new transforms.MultihashBlake2b64());
      hlInstance.use(new transforms.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hlInstance.verify({
          data: testData,
          hashlink: 'hl:zm9YZiJ7LARpE6oz'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`use()`, function() {
      // create test JSON-LD
      const jsonldData = {
        "@type": ["http://schema.org/Person"],
        "http://schema.org/jobTitle": [{"@value": "Professor"}],
        "http://schema.org/name": [{"@value": "Jane Doe"}],
        "http://schema.org/telephone": [{"@value": "(425) 123-4567"}],
        "http://schema.org/url": [{"@id": "http://www.janedoe.com"}]
      };

      // setup the encoder/decoder
      const hlInstance = new Hashlink();

      class Urdna2015 {
        constructor() {
          this.identifier = new Uint8Array([]);
          this.algorithm = 'urdna2015';
        }

        async encode(input) {
          const inputJsonld = JSON.parse(new TextDecoder().decode(input));
          return await jsonld.canonize(
            inputJsonld, {format: 'application/n-quads'});
        }
      }

      hlInstance.use(new Urdna2015());
      hlInstance.use(new transforms.MultihashSha2256());
      hlInstance.use(new transforms.MultibaseBase58btc());

      it('use() with custom JSON-LD transform', async function() {
        const result = await hlInstance.create({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          transforms: ['urdna2015', 'mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmVcHtE3hUCF3s6fgjohUL3ANsKGnmRC9UsEaAjZuvgzdc');
      });
    });
  });

  describe(`convenience functionality`, function() {
    describe(`create()`, function() {

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

    describe(`verify() [sha2-256]`, function() {

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hl.verify({
          data: testData,
          hashlink: 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`verify() [blake2b-64]`, function() {
      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hl.verify({
          data: testData,
          hashlink: 'hl:zm9YZiJ7LARpE6oz'
        });

        chai.expect(result).to.equal(true);
      });
    });
  });
});
