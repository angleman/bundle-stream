// mocha doc: http://visionmedia.github.io/mocha/

assert = require('assert')
//mocha = require('mocha')
//should = mocha.should

describe('basic', function() {
    it('module loads', function() {
		bundleStream = require('../index.js')
		assert(bundleStream !== undefined)
    })
})
