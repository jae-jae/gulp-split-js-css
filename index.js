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

function getFilename(filepath,opts) {
	var basename = path.basename(filepath, path.extname(filepath));
	var names = {
		js: basename + '.js',
		css:basename + '.css'
	};
	names[opts.pageType] = basename + '.' + opts.pageType;
	return names;
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
	rt[opts.pageType] = $.html();
	return rt;
}

function getFileExt(path)
{
	return path.split('.').pop();
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

		opts.pageType = getFileExt(file.path);
		var splitfile = getFilename(file.path,opts);

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