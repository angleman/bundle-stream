// json-bundle-stream by angleman, MIT
// bundle json stream entries by timestamp granularity
"use strict"

var xtend  = require('xtend') // extend objects.  Raynos/xtend
var util   = require('util')
var stream = require('stream').Transform
if (!stream) stream = require('readable-stream').Transform // stream 2 compatible

// json string in and out
function JsonBundleStream(config) {
 	stream.call(this, { objectMode: true })
	var granularities = { // assuming timestamps in the form of YYYY-MM-DD hh:mm:ss
		year:       4,    years:      4,
		month:      7,    months:     7,
		day:        10,   days:       10,
		hour:       13,   hours:      13,
		tenminute:  15,   tenminutes: 15,
		minute:     16,   minutes:    16,
		tensecond:  18,   tenseconds: 18,
		second:     19,   seconds:    19
	}
	var DEFAULT = {
		timeField:   'timestamp',
		granularity: 'second',
		stamp:       false,
		only:        undefined, // only this timestamp,
		delimiter:  "\n"
	}
	config          = xtend(DEFAULT, config)
	var timeField   = config.timeField
	var only        = config.only
	var mergeLength = (only) ? only.length : granularities[config.granularity]
	this.__bundle   = []
	var lasttime    = ''
	this.__stats    = {
		rowsIn: 0,
		bundlesOut: 0
	}

	this.__pushBundle = function() { // push bundle down stream
		if (this.__bundle.length > 0) {
			this.__stats.bundlesOut++
			var json    = JSON.stringify(this.__bundle) + config.delimiter
			var data    = new Buffer(json, 'utf8')
			this.__bundle = []
			this.push(data)
		}
	}

	this.stats = function() {
		return this.__stats
	}

	this._transform = function (data, encoding, callback) {
		if (data) {
			this.__stats.rowsIn++
			var json   = data.toString('utf8')
			var parsed = JSON.parse(json)
			if (!parsed[timeField]) throw new Error('Missing timeField:', timeField)
			
			var subtime = parsed[timeField].substr(0, mergeLength)
			if (only) {
				if (subtime == only) {
					this.__bundle.push(parsed) // add data to bundle
				} else {
					this.__pushBundle() // push bundle down stream
				}
			} else {
				if (subtime > lasttime) {
					lasttime = subtime
					this.__pushBundle() // push bundle down stream
				}
				this.__bundle.push(parsed) // add data to bundle
			}
		} else {
			this.__pushBundle() // push bundle down stream
			this.push(data)
		}
		callback()
	}
}

util.inherits(JsonBundleStream, stream)
module.exports = JsonBundleStream
