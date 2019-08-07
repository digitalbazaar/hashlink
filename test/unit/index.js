/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const chai = require('chai');
const {Hashlink} = require('../../');
import {stringToUint8Array} from '../../util.js';

chai.should();

describe('hashlink', function() {
  describe(`convenience API`, function() {

    const testData = stringToUint8Array('Hello World!');
    const exampleUrl = 'https://example.com/hw.txt';

    it('should create a hashlink (data + URL)', async function() {
      const result = await hl.create({
        data: testData,
        url: exampleUrl
      });

      console.log("HL:", result);
      result.should.be.a.string;
    });

});
