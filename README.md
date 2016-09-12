## Quick start

```js
// config.js
module.exports = {
	mongo: {
		$init: function (params) {
			// returns a Promise
			return require('mongodb').MongoClient.connect(
				'mongodb://' + params.host + ':' + params.port + '/' params.db
			)
		},
		$default: {
			db: 'test',
			port: 27017
		},
		$development: {
			host: '127.0.0.1'
		},
		$production: {
			db: 'prod',
			host: '192.168.0.10'
		}
	},
	redis: {
		$init: function (params) {
			return require('redis').createClient(params)
		},
		$default: {
			port: 6379
		},
		$development: {
			host: '127.0.0.1'
		},
		$production: {
			host: '192.168.0.11'
		}
	}
}
```

```js
// index.js
require('no-config')({config: require(./config)}).then(
	function(config) {
		console.log('ENV', config.env)
		
		console.log('Started mongo on', config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db)
		console.log('Started redis on', config.redis.host + ':' + config.redis.port)
		
		config.mongo.$instance.collection('documents').insert({hello: 'world'})
		config.redis.$instance.set('hello', 'world')
	}
)
```

```
> node index.js
ENV development
Started mongo on 127.0.0.1:27017/test
Started redis on 127.0.0.1:6379

> NODE_ENV=production node index.js
ENV production
Started mongo on 192.168.0.10:27017/prod
Started redis on 192.168.0.11:6379
```