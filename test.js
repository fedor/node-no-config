'use strict'

const co = require('co')
const test = require('tape')
const cloneDeep = require('lodash.clonedeep')
const intercept = require('intercept-stdout')

const noConfig = require('./index')

const config_base = {
	resource1: {
		default: {
			key0: 'resource1-default-value0',
			key1: 'resource1-default-value1'
		},
		env1: {
			key1: 'resource1-env1-value1',
			key2: 'resource1-env1-value2'
		},
		env2: {
			key1: 'resource1-env2-value1',
			key2: 'resource1-env2-value2'
		}
	},
	resource2: {
		default: {
			key0: 'resource2-default-value0',
			key1: 'resource2-default-value1'
		},
		env1: {
			key1: 'resource2-env1-value1',
			key2: 'resource2-env1-value2'
		},
		env2: {
			key1: 'resource2-env2-value1',
			key2: 'resource2-env2-value2'
		}
	}
}

test('NODE_ENV not set (removed): default values only', co.wrap(function* (t) {
	try {
		delete process.env.NODE_ENV
		let config = cloneDeep(config_base)
		let result = yield noConfig({config})
		let expected = {
			env: undefined,
			resource1: {
				key0: 'resource1-default-value0',
				key1: 'resource1-default-value1'
			},
			resource2: {
				key0: 'resource2-default-value0',
				key1: 'resource2-default-value1'
			}
		}
		t.deepEqual(result, expected)
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV not exists: default values only', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env0'
		let config = cloneDeep(config_base)
		let result = yield noConfig({config})
		let expected = {
			env: 'env0',
			resource1: {
				key0: 'resource1-default-value0',
				key1: 'resource1-default-value1'
			},
			resource2: {
				key0: 'resource2-default-value0',
				key1: 'resource2-default-value1'
			}
		}
		t.deepEqual(result, expected)
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV not exists, no default: empty objects', co.wrap(function* (t) {
	try {
		delete process.env.NODE_ENV
		let config = cloneDeep(config_base)
		delete config.resource1.default
		delete config.resource2.default
		let result = yield noConfig({config})
		let expected = {
			env: undefined,
			resource1: {},
			resource2: {}
		}
		t.deepEqual(result, expected)
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV set: NODE_ENV specific values', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		let result = yield noConfig({config})
		let expected = {
			env: 'env1',
			resource1: {
				key0: 'resource1-default-value0',
				key1: 'resource1-env1-value1',
				key2: 'resource1-env1-value2'
			},
			resource2: {
				key0: 'resource2-default-value0',
				key1: 'resource2-env1-value1',
				key2: 'resource2-env1-value2'
			}
		}
		t.deepEqual(result, expected)
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV set, init() is a function: init() gets expected input, result is captured', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.init = (input) => {
			let expected_input = {
				key0: 'resource1-default-value0',
				key1: 'resource1-env1-value1',
				key2: 'resource1-env1-value2'
			}
			t.deepEqual(input, expected_input)
			return 'resource1 init called'
		}
		config.resource2.init = function (input) {
			let expected_input = {
				key0: 'resource2-default-value0',
				key1: 'resource2-env1-value1',
				key2: 'resource2-env1-value2'
			}
			t.deepEqual(input, expected_input)
			return 'resource2 init called'
		}
		let result = yield noConfig({config})
		t.equal(result.resource1.instance, 'resource1 init called')
		t.equal(result.resource2.instance, 'resource2 init called')
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV set, init() returns a Promise, Promise resolves: result is captured', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.init = function () {
			return Promise.resolve('Promise result')
		}
		let result = yield noConfig({config})
		t.equal(result.resource1.instance, 'Promise result')
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV set, init() is a generator function and returns result: result is captured', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.init = function* () {
			return 'generator function result'
		}
		let result = yield noConfig({config})
		t.equal(result.resource1.instance, 'generator function result')
	} catch (e) {
		t.fail(e)
	}
	t.end()
}))

test('NODE_ENV set, init() returns Promise, Promise rejects: rejects', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.init = function () {
			return Promise.reject('Promise error')
		}
		yield noConfig({config})
		t.fail('Failure was expected')
	} catch (e) {
		t.equal(e, 'Promise error')
	}
	t.end()
}))

test('NODE_ENV set, init() is a function and throws error: rejects', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.init = function () {
			throw 'function error'
		}
		yield noConfig({config})
		t.fail('Failure was expected')
	} catch (e) {
		t.equal(e, 'function error')
	}
	t.end()
}))

test('NODE_ENV set, init() is a generator function and throws error: rejects', co.wrap(function* (t) {
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.init = function* () {
			throw 'generator function error'
		}
		yield noConfig({config})
		t.fail('Failure was expected')
	} catch (e) {
		t.equal(e, 'generator function error')
	}
	t.end()
}))

test('NODE_ENV set, verbose mode: result is printed, "key*" values are masked', co.wrap(function* (t) {
	let lines = []
	let unhook_intercept = intercept(function (line) {
		line = line.trim()
		if (line) {
			lines.push(line)
		}
		return ''
	})
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.default.param3 = 'resource1-default-value3'
		config.resource1.init = function () {}
		yield noConfig({config, verbose: true})
		let expected_lines = [
			'[resource1]: starting',
			'[resource1]: key0:           ********************',
			'[resource1]: key1:           ********************',
			'[resource1]: param3:         resource1-default-value3',
			'[resource1]: key2:           ********************'
		]
		t.deepEqual(lines, expected_lines)
	} catch (e) {
		t.fail(e)
	}
	unhook_intercept()
	t.end()
}))

test('NODE_ENV set, verbose mode, unmasked: result is printed', co.wrap(function* (t) {
	let lines = []
	let unhook_intercept = intercept(function (line) {
		line = line.trim()
		if (line) {
			lines.push(line)
		}
		return ''
	})
	try {
		process.env.NODE_ENV = 'env1'
		let config = cloneDeep(config_base)
		config.resource1.default.param3 = 'resource1-default-value3'
		config.resource1.init = function () {}
		yield noConfig({config, verbose: true, mask_secrets: false})
		let expected_lines = [
			'[resource1]: starting',
			'[resource1]: key0:           resource1-default-value0',
			'[resource1]: key1:           resource1-env1-value1',
			'[resource1]: param3:         resource1-default-value3',
			'[resource1]: key2:           resource1-env1-value2'
		]
		t.deepEqual(lines, expected_lines)
	} catch (e) {
		t.fail(e)
	}
	unhook_intercept()
	t.end()
}))
