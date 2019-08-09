/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const chai = require('chai');
const {Hashlink} = require('../../');
const hl = require('../../');
const {stringToUint8Array} = require('../../util.js');

chai.should();

describe('hashlink', function() {
  describe(`convenience API`, function() {

    const testData = stringToUint8Array('Hello World!');
    const exampleUrl = 'https://example.com/hw.txt';

    it('should create a hashlink (data + URL)', async function() {
      const result = await hl.create({
        data: testData,
        urls: [exampleUrl]
      });

      console.log("HL:", result);
      result.should.be.a.string;
    });
  });
});
