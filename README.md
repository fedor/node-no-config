[npm-image]: https://img.shields.io/npm/v/no-config.svg?style=flat-square
[npm-url]: https://npmjs.org/package/no-config
[travis-image]: https://img.shields.io/travis/fedor/node-no-config.svg?style=flat-square
[travis-url]: https://travis-ci.org/fedor/node-no-config
[codecov-image]: https://img.shields.io/codecov/c/github/fedor/node-no-config.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/fedor/node-no-config
[david-image]: https://img.shields.io/david/fedor/node-no-config.svg?style=flat-square
[david-dev-image]: https://img.shields.io/david/dev/fedor/node-no-config.svg?style=flat-square
[david-url]: https://david-dm.org/fedor/node-no-config
[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][codecov-image]][codecov-url]
[![Dependency Status][david-image]][david-url]
[![Dependency Status][david-dev-image]][david-url]  
[Intro](#intro) | [Quick start](#quick-start) | [Quick start (ES6)](#quick-start-es6) | [API](#api) | [Contributors](#contributors) | [TODO](#todo)
## Intro  
> Why not `config`?

[**Answer**](https://medium.com/@fedorHK/no-config-b3f1171eecd5). TL;DR: `config` separates data to different files based on `NODE_ENV`, not resources.  
```
$ npm install no-config
```
## Quick start
```js
// config.js
module.exports = {
	redis: {
		init: function (params) {
			return require('redis').createClient(params)
		},
		default: {
			db: 0,
			port: 6379
		},
		development: {
			host: '127.0.0.1'
		},
		production: {
			db: 1,
			host: '192.168.0.10'
		}
	}
}
```

```js
// index.js
require('no-config')({
	config: require('./config')
}).then(
	function(conf) {
		console.log('ENV', conf.env)
		console.log('Redis:', conf.redis.host+':'+conf.redis.port)
		conf.redis.instance.set('hello', 'world')
	}
)
```
```
$ NODE_ENV=development node index.js
ENV development
Redis: 127.0.0.1:6379
```
## Quick start (ES6)
Since no-config returns a promise it is much better to use ES6 generators, arrow functions and [co](https://github.com/tj/co).  
**If you are not familiar with co, check this step-by-step [tutorial](https://github.com/fedor/co_demo)**

```js
// config.js
module.exports = {
	redis: {
		init: params => require('redis').createClient(params),
		default: {
			db: 0,
			port: 6379
		},
		development: {
			host: '127.0.0.1'
		},
		production: {
			db: 1,
			host: '192.168.0.10'
		}
	}
}
```

```js
// index.js
'use strict'
const co = require('co')
co(function* () {
	let config = require('./config')
	let conf = yield require('no-config')({config})

	console.log('ENV', conf.env)
	console.log('Redis:', conf.redis.host+':'+conf.redis.port)
	conf.redis.instance.set('hello', 'world')
})
```
## API

### Loader
```js
require('no-config')(parameters)
```
Loads resources from `parameters.config` based on `NODE_ENV` environment variable. Returns a Promise which resolves ones all resources are initialized.

**Parameters**

| Name           | Required? | Type            | Default       | Description                                              |
| -------------- | --------- | --------------- | ------------- | -------------------------------------------------------- |
| `config`       | Required  | Object          |               | [Configuration object](#configuration-object)            |
| `init`         | Optional  | List of strings | All Resources | Resources to initialize                                  |
| `verbose`      | Optional  | Boolean         | `false`       | Print resource input prior to call its `init()` function |
| `mask_secrets` | Optional  | Boolean         | `true`        | if `verbose === true` will hide input value if its key contains substrings: `secret`, `token`, `key`, `pass` or `pwd` |

### Configuration object
Every high-level key in configuration object is a resource name.

| Name                | Required? | Type       | Default            | Description. Handling                               |
| ------------------- | --------- | ---------- | ------------------ | --------------------------------------------------- |
| `<RESOURCE>`        | Optional  | Object     |                    | Resource configuration                              |
| `<RESOURCE>.defaut` | Optional  | Object     | `{}`               | Default values                                      |
| `<RESOURCE>.<ENV>`  | Optional  | Object     | `{}`               | ENV specific values. If a key duplicates `default` key, env-specific value is used |
| `<RESOURCE>.init`   | Optional  | Function, Generator function  | | Called to initalize resource, `<RESOURCE>.init(result)`. If returns Promise or Generator, it got resolved with [co](https://github.com/tj/co). Result is saved to `result.instance`. |

## Contributors
Fedor Korshunov - [view contributions](https://github.com/fedor/node-no-config/commits?author=fedor)  
Anurag Sharma - [view contributions](https://github.com/fedor/node-no-config/commits?author=anuragCES)
