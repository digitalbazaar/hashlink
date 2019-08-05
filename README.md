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

There are two ways to create a hashlink using the command line tool. The
first is to provide a URL to the data:

```bash
./bin/hl encode --url "https://example.com/hw.txt"
```

The second way is to provide a data file and a URL where the file will be
published to:

```bash
./bin/hl encode hw.txt --url "https://example.com/hw.txt"
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

```base
./bin/hl verify "hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF"
```

The command above will result in the following output:

```
URLs: https://example.com/hw.txt
Content hash: valid
```

## API

The API is useful when integrating this library with a larger software system.

### Creating a Hashlink

You can create a hashlink from an existing URL:

```js
const hl = require('hashlink');

// create a hashlink using the defaults
const url = new Url('https://example.com/hw.txt');
const hlUrl = await hl.create(url);

// print out the hashlink
console.log(hlUrl);
```

You can create a hashlink from data:

```js
const hl = require('hashlink');

// create a hashlink using data to be published at a URL
const data = new ArrayBuffer('Hello World!');
const url = new Url('https://example.com/hw.txt');
const hlUrl = await hl.create(data, {'url': [url]});

// print out the hashlink
console.log(hlUrl);
```

You can change the default options used by the hashlink function:

```js
const jsonld = require('jsonld');
const hl = require('hashlink');

// setup hl library to use RDF Dataset Canonicalization
hl.use('rdc2015', jsonld);

// create a hashlink using canonicalized data published at a URL
const url = new Url('https://example.com/credential.jsonld');
const hlUrl = await hl.create(url, {
                      'hash': 'blake2b-32',
                      'canonize': 'rdc2015',
                      'content-type': 'application/ld+json'
                    });

// print out the hashlink
console.log(hlUrl);
```

### Decoding a Hashlink

You can decode a hashlink by simply calling decode:

```js
const hl = require('hashlink');

const hlUrl = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const hlData = hl.decode(hlUrl);

// print out the decoded hashlink information (an object)
console.log(hlData);
```

### Decoding a Hashlink

You can verify the integrity of a hashlink:

```js
const hl = require('hashlink');

const hlUrl = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const valid = await hl.verify(hlUrl);

// print out whether or not the hashlink is valid
console.log(valid);
```

In some cases, you need to be able to canonize the contents of the hashlink
in order to verify it:

```js
const jsonld = require('jsonld');
const hl = require('hashlink');

// setup hl library to use RDF Dataset Canonicalization
hl.use('rdc2015', jsonld);

// create a hashlink using canonicalized data published at a URL
const hlUrl = 'hl:zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e:zuh8iaLobXC8g9tfma1CSTtYBakXeSTkHrYA5hmD4F7dCLw8XYwZ1GWyJ3zwF';
const valid = await hl.verify(hlUrl);

// print out whether or not the hashlink is valid
console.log(valid);
```

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

