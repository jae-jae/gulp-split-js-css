# gulp-split-js-css
Gulp split js and css from html,gulp从html中分离出js和css
## Installation
```shell
npm install gulp-split-js-css
```
## Usage
`gulpfile.js`

```javascript
var gulp = require('gulp');
var splitJsCss = require('gulp-split-js-css');

//文件过滤
var filter = require('gulp-filter');
//在html中引用js和css
var inject = require('gulp-inject');

gulp.task('default', function() {
    var stream = gulp.src('./src/index.html')
        .pipe(splitJsCss({
        	type:['js','css']
        }));

      var jsFilter = filter('**/*.js');
      var cssFilter = filter('**/*.css');
      var htmlFilter = filter('**/*.html');

       var jsStream = stream.pipe(jsFilter);
       var cssStream = stream.pipe(cssFilter);
       var htmlStream = stream.pipe(htmlFilter);

        jsStream = jsStream.pipe(gulp.dest('dist/js'));
        cssStream = cssStream.pipe(gulp.dest('dist/css'));

        return htmlStream.pipe(inject(jsStream))
        .pipe(inject(cssStream))
        .pipe(gulp.dest('./dist'));

});
```

`./src/index.html`

```html
<!DOCTYPE html>
<html>
<head>
	<title>gulp-split-js-css</title>
<style type="text/css">
	body {
	    margin:0
	}
	a:hover, a:active {
	    outline:0
	}
</style>

<style type="text/css">
	abbr[title] {
	    border-bottom:1px dotted
	}
</style>

<!-- inject:css -->
<!-- endinject -->

</head>
<body>

<span>This is string.</span>

<script type="text/javascript">
	var msg = function(str){
		alert(str);
	};
</script>


<script type="text/javascript">
	var str = 'string';
	msg(str);
</script>

<!-- inject:js -->
<!-- endinject -->

</body>
</html>
```
### Out

`./dist/index.html`

```html
<!DOCTYPE html>
<html>
<head>
	<title>gulp-split-js-css</title>


<!-- inject:css -->
<link rel="stylesheet" href="/dist/css/index.css">
<!-- endinject -->

</head>
<body>

<span>This is string.</span>


<!-- inject:js -->
<script src="/dist/js/index.js"></script>
<!-- endinject -->

</body>
</html>
```

`./dist/js/index.js`

```javascript
	var msg = function(str){
		alert(str);
	};

	var str = 'string';
	msg(str);
```

`./dist/css/index.css`

```css
	body {
	    margin:0
	}
	a:hover, a:active {
	    outline:0
	}

	abbr[title] {
	    border-bottom:1px dotted
	}
```

## Parameters 参数

### options
#### type
Type:`String`|`Array`,split type `js` or `css`,defalut value `['js','css']`

