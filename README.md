## Quick start

```js
// config.js
module.exports = {
	mongo: {
		init: function (params) {
			// returns a Promise
			return require('mongodb').MongoClient.connect(
				'mongodb://'+params.host+':'+params.port+'/'+params.db
			)
		},
		default: {
			db: 'test',
			port: 27017
		},
		development: {
			host: '127.0.0.1'
		},
		production: {
			db: 'prod',
			host: '192.168.0.10'
		}
	},
	redis: {
		init: function (params) {
			return require('redis').createClient(params)
		},
		default: {
			port: 6379
		},
		development: {
			host: '127.0.0.1'
		},
		production: {
			host: '192.168.0.11'
		}
	}
}
```

```js
// index.js
require('no-config')({
	config: require(./config)
}).then(
	function(conf) {
		console.log('ENV', conf.env)
		
		console.log('Mongo:', conf.mongo.host+':'+conf.mongo.port+'/'+conf.mongo.db)
		console.log('Redis:', conf.redis.host+':'+conf.redis.port)
		
		conf.mongo.instance.collection('documents').insert({
			hello: 'world'
		})
		conf.redis.instance.set('hello', 'world')
	}
)
```

```
> npm install no-config
> NODE_ENV=development node index.js
ENV development
Mongo: 127.0.0.1:27017/test
Redis: 127.0.0.1:6379
> NODE_ENV=production node index.js
ENV production
Mongo: 192.168.0.10:27017/prod
Redis: 192.168.0.11:6379
```
