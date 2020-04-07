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
  /* eslint-disable quotes */
  const jsonldData = {
    "@type": ["http://schema.org/Person"],
    "http://schema.org/jobTitle": [{"@value": "Professor"}],
    "http://schema.org/name": [{"@value": "Jane Doe"}],
    "http://schema.org/telephone": [{"@value": "(425) 123-4567"}],
    "http://schema.org/url": [{"@id": "http://www.janedoe.com"}]
  };
  /* eslint-enable quotes */

  // setup URDNA2015 codec
  class Urdna2015 {
    constructor() {
      this.identifier = stringToUint8Array('urdna2015');
      this.algorithm = 'urdna2015';
    }

    async encode(input) {
      const inputJsonld = JSON.parse(new TextDecoder().decode(input));
      return stringToUint8Array(await jsonld.canonize(
        inputJsonld, {format: 'application/n-quads'}));
    }
  }

  describe(`Hashlink class`, function() {
    describe(`encode() [sha2-256]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('encode({data, codecs}) should encode a hashlink', async function() {
        const result = await hlInstance.encode({
          data: testData,
          codecs: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH');
      });

      it('encode({data, urls, codecs}) should encode a hashlink',
        async function() {
        const result = await hlInstance.encode({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('encode({data, urls, meta, codecs}) should encode a hashlink',
        async function() {
        const result = await hlInstance.encode({
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

    describe(`encode() [blake2b-64]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('encode({data, codecs}) should encode a hashlink', async function() {
        const result = await hlInstance.encode({
          data: testData,
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal('hl:zm9YZpCjPLPJ4Epc');
      });

      it('encode({data, urls, codecs}) should encode a hashlink',
        async function() {
        const result = await hlInstance.encode({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-blake2b-64', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zm9YZpCjPLPJ4Epc:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('encode({data, urls, meta, codecs}) should encode a hashlink',
        async function() {
        const result = await hlInstance.encode({
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

    describe(`encode() [urdna2015]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new Urdna2015());
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('encode({data, codecs}) should encode a hashlink', async function() {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          codecs: ['urdna2015', 'mh-blake2b-64', 'mb-base58-btc'],
          transform: ['urdna2015']
        });

        result.should.equal('hl:zm9YaHWNePhdaQ2J');
      });

      it('encode({data, urls, codecs}) should encode a hashlink',
        async function() {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          urls: [exampleUrl],
          codecs: ['urdna2015', 'mh-blake2b-64', 'mb-base58-btc'],
          transform: ['urdna2015']
        });

        result.should.equal(
          'hl:zm9YaHWNePhdaQ2J:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('encode({data, urls, meta, codecs}) should encode a hashlink',
        async function() {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain'
          },
          codecs: ['urdna2015', 'mh-blake2b-64', 'mb-base58-btc'],
          transform: ['urdna2015']
        });

        result.should.equal(
          'hl:zm9YaHWNePhdaQ2J:' +
          'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu');
      });
    });

    describe(`decode() [sha2-256]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('decode({hashlink}) should decode hash and metadata',
        async function() {
        const result = await hlInstance.decode({
          hashlink: 'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
            'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu'
        });

        result.hashName.should.equal('sha2-256');
        result.hashValue.toString('hex').should.equal(
          '03ba204e50d126e4674c005e04d82e84c21366780af1f43bd54a37816b6ab340');
        result.meta.url[0].should.equal(exampleUrl);
        result.meta['content-type'].should.equal('text/plain');
      });
    });

    describe(`decode() [blake2b-64]`, function() {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('decode({hashlink}) should decode hash and metadata',
        async function() {
        const result = await hlInstance.decode({
          hashlink: 'hl:zm9YZpCjPLPJ4Epc:' +
            'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu'
        });

        result.hashName.should.equal('blake2b-64');
        result.hashValue.toString('hex').should.equal('34377f929f5defa5');
        result.meta.url[0].should.equal(exampleUrl);
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
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          codecs: ['urdna2015', 'mh-sha2-256', 'mb-base58-btc']
        });

        result.should.equal(
          'hl:zQmVcHtE3hUCF3s6fgjohUL3ANsKGnmRC9UsEaAjZuvgzdc');
      });
    });
  });

  describe(`convenience functionality`, function() {
    describe(`encode()`, function() {

      it('encode({data}) should encode a hashlink', async function() {
        const result = await hl.encode({
          data: testData
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH');
      });

      it('encode({data, urls}) should encode a hashlink',
        async function() {
        const result = await hl.encode({
          data: testData,
          urls: [exampleUrl]
        });

        result.should.equal(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
          'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
      });

      it('encode({data, urls, meta}) should encode a hashlink',
        async function() {
        const result = await hl.encode({
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
