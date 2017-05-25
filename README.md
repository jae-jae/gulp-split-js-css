# gulp-split-js-css
Gulp split js and css from html,gulp从html中分离出js和css
## Installation
```shell
npm install gulp-split-js-css
```
## Usage 1

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

<style type="text/css" inline>
	.c-box{height:40px;width:100%;margin:150px auto;}
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


<script type="text/javascript" inline>
	var str2 = 'string2';
	msg(str2);
</script>

<!-- inject:js -->
<!-- endinject -->

</body>
</html>
```
### Out 输出结果

`./dist/index.html`

```html
<!DOCTYPE html>
<html>
<head>
	<title>gulp-split-js-css</title>

<style type="text/css" inline="">
	.c-box{height:40px;width:100%;margin:150px auto;}
</style>


<!-- inject:css -->
<link rel="stylesheet" href="/dist/css/index.css">
<!-- endinject -->

</head>
<body>

<span>This is string.</span>

<script type="text/javascript" inline="">
	var str2 = 'string2';
	msg(str2);
</script>

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

## Usage 2
```javascript
var gulp = require('gulp');

var sjc = require('gulp-split-js-css');

//文件过滤
var filter = require('gulp-filter');
//在html中引用js和css
var inject = require('gulp-inject');

var foreach = require('gulp-foreach');

gulp.task('default', function() {

  return gulp.src('./src/*.html')
    .pipe(foreach(function(streamX, file) {

      var stream = streamX.pipe(sjc({
        type: ['js', 'css']
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
        .pipe(inject(cssStream));

    })).pipe(gulp.dest('./dist'));

});

```

## Parameters 参数

### type 
Type:`String`|`Array`,split type `js` or `css`,defalut value `['js','css']`
指定分离类型，可以只分离出js或者css，默认都分离

**注**:标签加上`inline`属性后,将被跳过,不会被分离出来.

