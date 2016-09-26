'use strict'

const test = require('tape')
const noNodeConfig = require('./index')
const co = require('co')

// Mock config data
const keys = ['mongo', 'redis']
const PROCESS_ENV = process.env.NODE_ENV = 'development'
const config = {
	"mongo": {
		"default": {
			"db": "test",
			"port": 27017
		},
		"development": {
			"host": "127.0.0.1"
		},
		"production": {
			"db": "prod",
			"host": "192.168.0.10"
		}
	},
    "redis": {
		"default": {
			"port": 6379
		},
		"development": {
			"host": "127.0.0.1"
		},
		"production": {
			"host": "192.168.0.11"
		}
	}
}

test('Should initialize config object', co.wrap(function* (t) {
    try {
        let result = yield noNodeConfig({config})
        // assertions
        t.equal(typeof result, 'object', 'Returned value is an object')
        t.equal(Object.keys(result).length, Object.keys(config).length + 1, 'Returned object has equal length as input')
        let keyMatchSuccess = true
        keys.map((key) => {
            if (!(key in result)) {
                keyMatchSuccess = false
            }
        })
        t.equal(true, keyMatchSuccess, 'Contains all keys as input config object')
    } catch (e) {
        t.equal(e, undefined, 'No error')
    }
    t.end()
}))

test('Should return correct values as passed input', co.wrap(function* (t) {
    try {
        let result = yield noNodeConfig({config})
        // assertions
        t.equal(result.mongo.db, config.mongo.default.db, 'Has correct mongo db value')
        t.equal(result.mongo.port, config.mongo.default.port, 'Has correct mongo port value')
        t.equal(result.redis.port, config.redis.default.port, 'Has correct redis port value')
        t.equal(result.env, PROCESS_ENV, 'Has correct PROCESS_ENV')
    }
    catch (e) {
        t.equal(e, undefined, 'No error')
    }
    t.end()
}))