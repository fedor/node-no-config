## Installation
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
