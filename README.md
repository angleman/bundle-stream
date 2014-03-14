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

inStream.pipe(split).pipe(bundleStream).pipe(outStream)
```

Results of ```node example.js -f sample.json```

```js
[{"name": "joe", "age":"23", "registered": "2014-03-05"},{"name": "tom", "age":"35", "registered": "2014-03-05"}]
[{"name": "ann", "age":"25", "registered": "2014-03-06"}]
```

## Defaults

- **granularity**: second
- **timeField**: timestamp

## Contributions :muscle:

:smile: Feedback, problem reports, enhancement requests are welcome.

:up: Example code are better.

:cool: Pull requests are best.

## License

### MIT
