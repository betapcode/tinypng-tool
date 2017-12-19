# TT Tinypng Tool

> Handy command line tool for shrinking PNG images using the TinyPNG API

## Installation

	git clone https://github.com/betapcode/tinypng-tool.git
    cd <folder git>
    npm install

## Preamble

To use TT Tinypng Tool, you need an API key for TinyPNG. You can get one at [https://tinypng.com/developers](https://tinypng.com/developers).

## Usage

Edit file `config.js`:

```js
var config = {
    key: "<Key get from developer>",
    maxSize: 5242880,
    maxCount: 500
};
```

To check helper, use the `--h` flag

	node app.js --h

To shrink a single PNG image (`assets/img/demo.png` in this example) and output to tmp folded, you may run the following command.

	node app.js --path=assets/img/demo.png --output=/tmp

You may also provide multiple PNG images.

	node app.js --type=multi

To resize an image, use the `--width` and/or `--height` flag.

	node app.js --path=assets/img/demo.png --width=200
	node app.js --path=assets/img/demo.png --resize=fit --height=200
	node app.js --path=assets/img/demo.png --width=123 --height=123

That's it. Pretty easy, huh?

## Changelog

* 0.0.1
	* Initial version, and support single compress file
