// bundle-stream
xtend  = require('xtend') // extend objects.  Raynos/xtend
util   = require('util')
stream = require('stream').Transform
if (!stream) stream = require('readable-stream').Transform // stream 2 compatible

// json string in and out
function JsonDurationStream(config) {
	self    = this
 	stream.call(self, { objectMode: true })
	granularities = { // assuming timestamps in the form of YYYY-MM-DD hh:mm:ss
		year:       4,    years:      4,
		month:      7,    months:     7,
		day:        10,   days:       10,
		hour:       13,   hours:      13,
		tenminute:  15,   tenminutes: 15,
		minute:     16,   minutes:    16,
		tensecond:  18,   tenseconds: 18,
		second:     19,   seconds:    19
	}
	DEFAULT = {
		timeField:   'timestamp',
		granularity: 'second',
		stamp:       false,
		only:        undefined // only this timestamp
	}
	config      = xtend(DEFAULT, config)
	timeField   = config.timeField
	only        = config.only
	mergeLength = (only) ? only.length : granularities[config.granularity]
	bundle      = []
	lasttime    = ''

	function pushBundle() {
		if (bundle.length > 0) {
			json    = JSON.stringify(bundle)
			bundle  = []
			data    = new Buffer(json, 'utf8')
			self.push(data)
		}
	}

	self._transform = function (data, encoding, callback) {
		if (data) {
			json    = data.toString('utf8')
			parsed  = JSON.parse(json)
			if (!parsed[timeField]) throw new Error('Missing timeField:', timeField)
			
			subtime = parsed[timeField].substr(0, mergeLength)
			if (only) {
				if (subtime == only) {
					bundle.push(parsed)
				} else {
					pushBundle()
				}
			} else {
				if (subtime > lasttime) {
					lasttime = subtime
					pushBundle()
				}
				bundle.push(parsed)
			}
		} else {
			pushBundle()
			self.push(data)
		}
		callback()
	}
}

util.inherits(JsonDurationStream, stream);
module.exports = JsonDurationStream;
