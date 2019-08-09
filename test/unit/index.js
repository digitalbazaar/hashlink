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

    it('should create a hashlink (data, default options)', async function() {
      const result = await hl.create({
        data: testData
      });

      console.log("HL:", result);
      result.should.equal('hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e');
    });

    it('should create a hashlink (data + URL, default options)',
      async function() {
      const result = await hl.create({
        data: testData,
        urls: [exampleUrl]
      });

      console.log("HL:", result);
      result.should.equal('hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy');
    });

  });
});
