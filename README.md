# Javascript Cryptographic Hyperlinks Library _(hashlink)_

A Javascript library for encoding and decoding hashlinks.

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

TBD

## Background

TBD

See also (related specs):

* [IETF Hashlink RFC](https://tools.ietf.org/html/draft-sporny-hashlink)

## Install

- Node.js 8.3+ required.

To install locally (for development):

```
git clone https://github.com/digitalbazaar/hashlink.git
cd hashlink
npm install
```

## Usage

Use on the command line, or see the API section below.

### Creating a Hashlink

There are a number of ways you can create a hashlink. The simplest way is to
provide the data directly.

```bash
./bin/hl create hw.txt
```

You can create a hashlink from any data published on the Web:

```bash
./bin/hl create --url "https://example.com/hw.txt"
```

You can also create a hashlink from data on disk and specify the location on
the web that the data will be published to:

```bash
./bin/hl create --url "https://example.com/hw.txt" hw.txt
```

Hashlinks are also backwards compatible with legacy URL schemes, which enables
you to use query parameters to encode the hashlink information:

```bash
./bin/hl create --legacy --url "https://example.com/hw.txt" hw.txt
```

### Decoding a Hashlink

To decode a hashlink, you can run the following command:

```base
./bin/hl decode "hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF"
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

### Creating a Hashlink

You can create a hashlink from an existing URL:

```js
const hl = require('hashlink');

const url = 'https://example.com/hw.txt';
// create a hashlink by fetching the URL content and hashing it
const hlUrl = await hl.create({url});

// print out the hashlink
console.log(hlUrl);
```

You can create a hashlink from data:

```js
const hl = require('hashlink');

// create a hashlink using data to be published at a URL
const data = 'Hello World!';
const url = 'https://example.com/hw.txt';
const hlUrl = await hl.create({data, url});

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

// create a hashlink using canonicalized data published at a URL
const url = 'https://example.com/credential.jsonld';
// encode the input data using urdna2015 canonicalization algorithm and
// then hash using blake2b with a 32-bit output
const codecs = ['urdna2015', 'blake2b-32'];
const hlUrl = await hl.create({
  url,
  codecs,
  'content-type': 'application/ld+json'
});

// print out the hashlink
console.log(hlUrl);
```

### Decoding a Hashlink

You can decode a hashlink by simply calling decode:

```js
const hl = require('hashlink');

const url = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const hlData = hl.decode(url);

// print out the decoded hashlink information (an object)
console.log(hlData);
```

### Verifying a Hashlink

You can verify the integrity of a hashlink:

```js
const hl = require('hashlink');

const url = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const valid = await hl.verify(url);

// print out whether or not the hashlink is valid
console.log(valid);
```

In some cases, you need to be able to canonize the contents of the hashlink
in order to verify it:

```js
const {Hashlink} = require('hashlink');
const {Urdna2016} = require('hashlink-jsonld');

// setup hl library to use RDF Dataset Canonicalization codec
const hl = new Hashlink();
hl.use(new Urdna2015());

// create a hashlink using canonicalized data published at a URL
const hlUrl = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const valid = await hl.verify(hlUrl);

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
const hlUrl = await hl.create({url: 'https://example.com/hw.txt'});
```

In some cases, however, a developer will need to extend the default
transformations, like when input needs to be canonicalized before it is
hashed.

```js
const {Hashlink} = require('hashlink');
const {Urdna2015} = require('hashlink-jsonld');

// setup hl library to use RDF Dataset Canonicalization
const hl = new Hashlink();
hl.use(new Urdna2015());
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
