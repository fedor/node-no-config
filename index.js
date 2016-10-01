'use strict'
var maskKeys = ['secret', 'token', 'key', 'pass', 'pwd']
module.exports = require('co').wrap(function* (params) {
	var get = function (val, def) {
		return (val !== undefined) ? val : def
	}

	var env           = process.env.NODE_ENV
	var config        = params.config
	var resourcesList = Object.keys(config)
	var init          = get(params.init, resourcesList)
	var verbose       = get(params.verbose, false)
	var maskSecrets   = get(params.mask_secrets, true)

	var mask = function (key, val) {
		if (!maskSecrets) {
			return val
		}
		var matches = maskKeys.filter(function(maskKey) {
			return (key.toLowerCase().indexOf(maskKey) !== -1)
		})
		if (matches.length) {
			return '********************'
		}
		return val
	}

	var result = {}
	resourcesList.forEach(function (resourceName) {
		var resource       = config[resourceName]
		var default_config = resource.default || {}
		var env_config     = resource[env] || {}
		result[resourceName] = Object.assign({}, default_config, env_config)
	})
	for (var i = 0; i < init.length; i++) {
		var resourceName = init[i]
		var resource = config[resourceName]
		if (!resource.init) {
			continue
		}
		var resourceConfig = result[resourceName]
		if (verbose) {
			console.log('[' + resourceName + ']: starting')
			Object.keys(resourceConfig).forEach(function (key) {
				var value = mask(key, resourceConfig[key])
				var padding = ' '.repeat(Math.max(1, 15 - key.length))
				console.log('[' + resourceName + ']: ' + key + ':' + padding + value)
			})
			console.log()
		}
		try {
			resourceConfig.instance = resource.init(resourceConfig)
			resourceConfig.instance = yield resourceConfig.instance
		} catch (e) {
			// if TypeError === co error, resourceConfig.instance must not be "yieldable"
			if (!(e instanceof TypeError)) {
				throw e
			}
		}
	}
	result.env = env
	return result
})
