var express = require('express')
  , app = express()
  , swig = require('swig');

swig.setDefaults({
  root: __dirname + '/views',
  allowErrors: false,
  cache: false
});

swig.setFilter('percent', function (number) {
  return Math.floor(number * 100);
});

swig.setFilter('bytes', function(bytes) {
  if(bytes == 0) return '0 Byte';
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

module.exports = app;