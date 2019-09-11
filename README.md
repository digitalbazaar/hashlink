# Javascript Cryptographic Hyperlinks Library _(hashlink)_

[![NPM Version](https://img.shields.io/npm/v/hashlink.svg?style=flat-square)](https://npm.im/hashlink)
[![Build Status](https://travis-ci.org/digitalbazaar/hashlink.png?branch=master)](https://travis-ci.org/digitalbazaar/hashlink)

A Javascript library for encoding, decoding, and verifying hashlinks as
defined in the
[IETF Hashlink draft spec](https://tools.ietf.org/html/draft-sporny-hashlink).

Example Hashlinks:

- Regular Hashlink (without URL encoded)
  - `hl:zm9YZpCjPLPJ4Epc`
- Regular Hashlink (with URL encoded):
  - `hl:zm9YZpCjPLPJ4Epc:z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy`
- Hashlink as a query parameter:
  - `https://example.com/hw.txt?hl=zm9YZpCjPLPJ4Epc`

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Testing](#testing)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Security

Security is hard. Cryptography is harder. When in doubt, leave it to the
professionals.

While the authors of this library are professionals, and they have used
cryptographic primitives and libraries written by people more capable than them,
bugs happen. Implementers that use this library are urged to study the code and
perform a review of their own before using this library in a production system.

It is also possible to misuse this library in a variety of ways if you don't
know what you are doing. If you are ever in doubt, remember that cryptography
is hard. Leave it to the professionals.

## Background

When using a hyperlink to fetch a resource from the Internet, it is often
useful to know if the resource has changed since the data was published.
Cryptographic hashes, such as SHA-256, are often used to determine if
published data has changed in unexpected ways. Due to the nature of most
hyperlinks, the cryptographic hash is often published separately from the
link itself. The Hashlink specification describes a data model and serialization
formats for expressing cryptographically protected hyperlinks. The mechanisms
described in the Hashlink specification enables a system to publish a hyperlink
in a way that empowers a consuming application to determine if the resource
associated with the hyperlink has changed in unexpected ways.

See also (related specs):

* [IETF Hashlink draft spec](https://tools.ietf.org/html/draft-sporny-hashlink)
* [IETF Multihash draft spec](https://tools.ietf.org/html/draft-multiformats-multihash)
* [IETF Multibase draft spec](https://tools.ietf.org/html/draft-multiformats-multibase)

## Install

To use this library in the browser, you can include the latest version
via a simple script tag:

```
  <script src="https://unpkg.com/hashlink/dist/hashlink.min.js"></script>
```

To use the library in Node.js:

- Node.js 8.3+ required.

To install locally (for development):

```
git clone https://github.com/digitalbazaar/hashlink.git
cd hashlink
npm install
```

## Usage

Use on the command line, or see the API section below.

### Encoding a Hashlink

There are a number of ways you can encode a hashlink. The simplest way is to
provide the data directly.

```bash
./bin/hl encode hw.txt
```

You can encode a hashlink from any data published on the Web:

```bash
./bin/hl encode --url "https://example.com/hw.txt"
```

You can also encode a hashlink from data on disk and specify the location on
the web that the data will be published to:

```bash
./bin/hl encode --url "https://example.com/hw.txt" hw.txt
```

Hashlinks are also backwards compatible with legacy URL schemes, which enables
you to use query parameters to encode the hashlink information:

```bash
./bin/hl encode --legacy --url "https://example.com/hw.txt" hw.txt
```

### Decoding a Hashlink

To decode a hashlink, you can run the following command:

```base
./bin/hl decode hl:zm9YZpCjPLPJ4Epc:z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy
```

The command above will result in the following output:

```
URLs: https://example.com/hw.txt
sha256sum: 12207f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
```

### Verifying a Hashlink

To verify a hashlink, you can run the following command:

```
./bin/hl verify --file hw.txt hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH
```

The command above will result in the following output:

```
hashlink is valid
```

## API

The API is useful when integrating this library with a larger software system.

You can use the API in the browser by including the latest version
via a simple script tag:

```
  <script src="https://unpkg.com/hashlink/dist/hashlink.min.js"></script>
```

The rest of the examples in this section assume a node.js environment, but
all API calls listed below are also available in the browser version.

### Encoding a Hashlink

You can encode a hashlink from an existing URL (**coming soon**):

```js
const hl = require('hashlink');

const url = 'https://example.com/hw.txt';

// encode a hashlink by fetching the URL content and hashing it
const hlUrl = await hl.encode({url});

// print out the hashlink
console.log(hlUrl);
```

You can encode a hashlink from data:

```js
const hl = require('hashlink');

// encode a hashlink using data to be published at a URL
const data = fs.readFileSync('hw.txt');
const url = 'https://example.com/hw.txt';
const hlUrl = await hl.encode({data, url});

// print out the hashlink
console.log(hlUrl);
```

You can change the default options used by the hashlink function:

```js
const {Hashlink} = require('hashlink');
const {Urdna2015} = require('hashlink-jsonld');

// setup hl library to use RDF Dataset Canonicalization codec
const hl = new Hashlink();
hl.use(new Urdna2015());

// encode a hashlink using canonicalized data published at a URL
const url = 'https://example.com/credential.jsonld';
// encode the input data using urdna2015 canonicalization algorithm and
// then hash using blake2b with a 64-bit output
const codecs = ['urdna2015', 'blake2b-64'];
const hlUrl = await hl.encode({
  url,
  codecs,
  'content-type': 'application/ld+json'
});

// print out the hashlink
console.log(hlUrl);
```

### Decoding a Hashlink

You can decode a hashlink by simply calling decode (**coming soon**):

```js
const hl = require('hashlink');

const url = 'hl:zm9YZpCjPLPJ4Epc:z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy';
const hlData = hl.decode(url);

// print out the decoded hashlink information (an object)
console.log(hlData);
```

### Verifying a Hashlink

You can verify the integrity of a hashlink:

```js
const hl = require('hashlink');

const hashlink = 'hl:zm9YZpCjPLPJ4Epc:z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy';
const data = '...';
const valid = await hl.verify({hashlink, data});

// print out whether or not the hashlink is valid
console.log(valid);
```

### Advanced Verification

In some cases, you need to be able to canonize the contents of the hashlink
in order to verify it:

```js
const {Hashlink} = require('hashlink');
const {Urdna2016} = require('hashlink-jsonld');

// setup hl library to use RDF Dataset Canonicalization codec
const hl = new Hashlink();
hl.use(new Urdna2015());

// encode a hashlink using canonicalized data published at a URL
const hlUrl = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:' +
  'zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const valid = await hl.verify({hashlink: hlUrl});

// print out whether or not the hashlink is valid
console.log(valid);
```
### Extending the Hashlink Library

The Hashlink library is built to support arbitrary transformations of
input data using codecs (encoder/decoders).

The Hashlink library has an internal default instance of a Hashlink
class that is provided as a convenience so that for most use cases, the
defaults work just fine.

```js
const hl = require('hashlink');
const hlUrl = await hl.encode({url: 'https://example.com/hw.txt'});
```

In some cases, however, a developer will need to extend the default
transformations, like when input needs to be canonicalized before it is
hashed.

```js
const {Hashlink} = require('hashlink');
const jsonld = require('jsonld');

// setup URDNA2015 codec that encodes
class Urdna2015 {
  constructor() {
    this.algorithm = 'urdna2015';
  }

  async encode(input) {
    const inputJsonld = JSON.parse(new TextDecoder().decode(input));
    return await jsonld.canonize(
      inputJsonld, {format: 'application/n-quads'});
  }
}

// setup hl library to use RDF Dataset Canonicalization
const hl = new Hashlink();
hl.use(new Urdna2015());

// encode a hashlink using canonicalized data published at a URL
const url = 'https://example.com/credential.jsonld';

// encode the input data using urdna2015 canonicalization algorithm and
// then hash using blake2b with a 64-bit output
const codecs = ['urdna2015', 'blake2b-64'];
const hlUrl = await hl.encode({
  url,
  codecs,
  'content-type': 'application/ld+json'
});

// print out the hashlink
console.log(hlUrl);
```

Note the use of the `Hashlink` class above as well as the `use()` API. Using
this API, any arbitrary number of transforms may be applied to the input
data before the final hashlink value is produced.

## Testing

To run Mocha tests:

```
npm run mocha
```

To run the VC Test Suite:

```
npm run fetch-hl-test-suite
npm test
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

Small note: If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © Digital Bazaar

## Acknowledgements

The authors of this package thank Daniel Levett
([dlevs](https://github.com/dlevs/)) for contributing the `hashlink` npm package
name for use with this project.
