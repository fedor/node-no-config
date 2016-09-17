const test = require('tape')
const noNodeConfig = require('./index')
const co = require('co')
const config = require('./testConfig/configData')
const keys = ['mongo', 'redis']
const PROCESS_ENV = process.env.NODE_ENV = 'test_env'

const configObject = co(function* () {
    return yield noNodeConfig({config})
})

test('Should initialize config object', (t) => { 
    t.plan(3)
    configObject.then((conf) => {
        t.equal(typeof conf, 'object', 'Returned value is an object')
        t.equal(Object.keys(conf).length, Object.keys(config).length + 1, 'Returned object has equal length as input')
        let keyMatchSuccess = true
        keys.map((key) => {
            if (!(key in conf)) {
                keyMatchSuccess = false
            }
        })
        t.equal(true, keyMatchSuccess, 'Contains all keys as input config object')
    })
})

test('Should return correct values as passed input', (t) => { 
    t.plan(4)

    configObject.then((conf) => {
        t.equal(conf.mongo.db, config.mongo.default.db, 'Has correct mongo db value')
        t.equal(conf.mongo.port, config.mongo.default.port, 'Has correct mongo port value')
        t.equal(conf.redis.port, config.redis.default.port, 'Has correct redis port value')
        t.equal(conf.env, PROCESS_ENV, 'Has correct PROCESS_ENV')
    })
})