/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const chai = require('chai');
const {Hashlink} = require('../../');
const hl = require('../../');
const jsonld = require('jsonld');
const {stringToUint8Array, TextDecoder} = require('../../util.js');
const defaultCodecs = require('../../codecs.js');

chai.should();

describe('hashlink library', function() {
  // setup test data
  const testData = stringToUint8Array('Hello World!\n');
  const exampleUrl = 'https://example.com/hw.txt';

  // setup JSON-LD tests
  const jsonldData = {
    "@type": ["http://schema.org/Person"],
    "http://schema.org/jobTitle": [{"@value": "Professor"}],
    "http://schema.org/name": [{"@value": "Jane Doe"}],
    "http://schema.org/telephone": [{"@value": "(425) 123-4567"}],
    "http://schema.org/url": [{"@id": "http://www.janedoe.com"}]
  };

  // setup URDNA2015 codec
  class Urdna2015 {
    constructor() {
      this.identifier = stringToUint8Array('urdna2015');
      this.algorithm = 'urdna2015';
    }

    async encode(input) {
      const inputJsonld = JSON.parse(new TextDecoder().decode(input));
      return await jsonld.canonize(
        inputJsonld, {format: 'application/n-quads'});
    }
  }

  describe(`Hashlink class`, function() {
    describe(`create() [sha2-256]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('create({data, codecs}) should create a hashlink', async function() {
        const result = await hlInstance.create({
          data: testData,
          codecs: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH');
      });

      it('create({data, urls, codecs}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('create({data, urls, meta, codecs}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain'
          },
          codecs: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`create API (blake2b-64)`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('create({data, codecs}) should create a hashlink', async function() {
        const result = await hlInstance.create({
          data: testData,
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal('hl:zm9YZpCjPLPJ4Epc');
      });

      it('create({data, urls, codecs}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZpCjPLPJ4Epc:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('create({data, urls, meta, codecs}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain'
          },
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZpCjPLPJ4Epc:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`create() [blake2b-64]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('create({data, codecs}) should create a hashlink', async function() {
        const result = await hlInstance.create({
          data: testData,
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal('hl:zm9YZpCjPLPJ4Epc');
      });

      it('create({data, urls, codecs}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZpCjPLPJ4Epc:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('create({data, urls, meta, codecs}) should create a hashlink',
        async function() {
        const result = await hlInstance.create({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain'
          },
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZpCjPLPJ4Epc:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`verify() [sha2-256]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hlInstance.verify({
          data: testData,
          hashlink: 'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`verify() [blake2b-64]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hlInstance.verify({
          data: testData,
          hashlink: 'hl:zm9YZpCjPLPJ4Epc'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`verify() [urdna2015]`,
      function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new Urdna2015());
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink',
        async function() {
        const result = await hlInstance.verify({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          hashlink:
            'hl:zQmVcHtE3hUCF3s6fgjohUL3ANsKGnmRC9UsEaAjZuvgzdc:' +
            'zER21ZLCmb3bkKNtm8g'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`use()`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new Urdna2015());
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('use() with custom JSON-LD transform', async function() {
        const result = await hlInstance.create({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          codecs: ['urdna2015', 'mh-sha2-256', 'mb-base58-btc']
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

        result.should.equal('hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH');
      });

      it('create({data, urls}) should create a hashlink',
        async function() {
        const result = await hl.create({
          data: testData,
          urls: [exampleUrl]
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
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
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`verify() [sha2-256]`, function() {

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hl.verify({
          data: testData,
          hashlink: 'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH'
        });

        chai.expect(result).to.equal(true);
      });
    });

    describe(`verify() [blake2b-64]`, function() {
      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hl.verify({
          data: testData,
          hashlink: 'hl:zm9YZpCjPLPJ4Epc'
        });

        chai.expect(result).to.equal(true);
      });
    });
  });
});
