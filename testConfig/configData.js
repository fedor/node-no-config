const configData = {
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

module.exports = configData  