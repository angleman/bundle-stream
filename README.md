# json-bundle-stream

bundle json stream entries by timestamp granularity 

## Install :hammer:

```sh
npm install json-bundle-stream
```

## Usage :bulb:

sample.json

```js
{"name": "joe", "age":"23", "registered": "2014-03-05"}
{"name": "tom", "age":"35", "registered": "2014-03-05"}
{"name": "ann", "age":"25", "registered": "2014-03-06"}
```

example.js

```js
inStream     = require('in-stream')
split        = new require('split')()
bundleStream = new require('json-bundle-stream')({ granularity: 'day', timeField: 'registered' })
outStream    = require('out-stream')

inStream.pipe(split).pipe(bundleStream).pipe(outStream).on('end', function() {
	console.log(bundleStream.stats())
})
```

You can be informed when the granularity changes

```js
bundleStream.on('bundle', function(timestampOfBundleChange) {
	console.log(timestampOfBundleChange) // 2014-03-05
})
```

Bundles can also have entry limits, ex:


```js
bundleStream = new require('json-bundle-stream')({ granularity: 'day', timeField: 'registered', maxBundleCount: 100})
```

Default ```maxBundleCount``` is 0 for no-limit

Results of ```node example.js -f sample.json```

```js
[{"name": "joe", "age":"23", "registered": "2014-03-05"},{"name": "tom", "age":"35", "registered": "2014-03-05"}]
[{"name": "ann", "age":"25", "registered": "2014-03-06"}]
```

Note: with the ```maxBundleCount = 1``` in 0.2.x, data is passed-thru without being converted to an array

## Defaults

- **granularity**: second
- **timeField**: timestamp
- **maxBundleCount**: 0
- **only**: false, if true then only the first match is bundled and passed thru filtering all other data

## Granularities

```
granularities = { // assuming timestamps in the form of 'YYYY-MM-DD hh:mm:ss'
	year:       4,    years:      4,
	month:      7,    months:     7,
	day:        10,   days:       10,
	hour:       13,   hours:      13,
	tenminute:  15,   tenminutes: 15,
	minute:     16,   minutes:    16,
	tensecond:  18,   tenseconds: 18,
	second:     19,   seconds:    19
}
```

## Contributions :muscle:

:smile: Feedback, problem reports, enhancement requests are welcome.

:up: Example code are better.

:cool: Pull requests are best.

## License

### MIT
