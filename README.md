[Intro](#intro) | [Quick start](#quick-start) | [Quick start (ES6)](#quick-start-es6) | [Reference](#reference)
## Intro

Why not `config`?

Answer: [(Node.js) config done right](https://medium.com/@fedorHK/no-config-b3f1171eecd5)

TL;DR: Because `config` separates data to different files based on `NODE_ENV`, not resources.

**Installation:**
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
```
$ NODE_ENV=production node index.js
ENV production
Redis: 192.168.0.10:6379
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
Returns a Promise.

**Parameters**

| Name         | Required? | Type            | Default       | Description                                              |
| ------------ | --------- | --------------- | ------------- | -------------------------------------------------------- |
| config       | Required  | Object          |               | [Configuration object](#configuration-object)            |
| init         | Optional  | List of strings | All Resources | Resources to initialize                                  |
| verbose      | Optional  | Boolean         | `false`       | Print resource input prior to call its `init()` function |
| mask_secrets | Optional  | Boolean         | `true`        | if `verbose === true` will hide input value if its key contains substrings: `secret`, `token`, `key`, `pass` or `pwd` |
