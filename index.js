'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var cheerio = require('cheerio');
var oassign = require('object-assign');

function splitFile(file, filename, contents) {
	return new gutil.File({
		cwd: file.cwd,
		base: file.base,
		path: path.join(path.dirname(file.path), filename),
		contents: new Buffer(contents)
	});
}

function getFilename(filepath) {
	var basename = path.basename(filepath, path.extname(filepath));
	return {
		html: basename + '.html',
		js: basename + '.js',
		css:basename + '.css'
	};
}

function splitHtml(html,opts)
{
	let types = opts.type || ['js','css'];
	typeof(types) == 'string' && (types = [types]);
	let selMap = {'js': 'script:not(script[src])','css': 'style'};
	let $ = cheerio.load(html);
	let rt = {};
	for(let i in types)
	{
		let key = types[i];
		let val = selMap[key];
		rt[key] = ''
		$(val).each(function(){
            rt[key] += "\r\n" + $(this).html();
         });
		$(val).remove();
	}
	rt['html'] = $.html();
	return rt;
}

module.exports = function (opts) {
	opts = opts || {};
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-split-js-css', 'Streaming not supported'));
			return;
		}

		var splitfile = getFilename(file.path);

		var split = splitHtml(file.contents.toString(),opts);

		var stream = this;

		Object.keys(split).forEach(function (type) {
			if (split[type]) {
				stream.push(splitFile(file, splitfile[type], split[type]));
			}
		});

		cb();
	});
};