var express = require('express');
var routes = require('./routes/all.js');
var browserify = require('browserify-middleware');
var http = require('http');
var path = require('path');
var cons = require('consolidate')
var jsonp = require('jsonp');
var nib = require('nib');

var app = express();

app.engine('dust', cons.dust);
cons.dust.helpers = require('dustjs-helpers');

app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
// app.set('view options', { layout: true });
app.set('env','development');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());

var stylus = require('stylus');
var jeet = require('jeet');
var nib = require('nib');
var rupture = require('rupture');
var typographic = require('typographic');
var axis = require('axis-css');

app.use(express.static(path.join(__dirname, '/public')));

app.use(stylus.middleware({
    src: __dirname + '/styles/',
    dest: __dirname + '/public/css/',
    debug: true,
    force: true,
    compile: function compile(str, path) {
        return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
        .import('nib');
    }
}));

var shared = ['jsonp','lazy.js','moment'];
app.get('/js/bundle.js', browserify(shared));

app.get('/pages/:page', routes.pages);

app.get('/',function(req,res){
    res.redirect('/pages/chart');
})

app.get('/savedfeed', function(req,res){
    res.sendfile('./public/data/hourly240.json');
});

app.post('/pages/save',function(req,res){
    var fs = require('fs');

    var outputFilename = './public/data/hourly240.json';

    var cache = [];
    fs.writeFile(outputFilename, JSON.stringify(res, function(key,value){
       if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            return;
        }
        cache.push(value);
    }
    return value;
}), function(err) {
        if(err) {
          console.log(err);
      } else {
          console.log("JSON saved to " + outputFilename);
      }
  });     
    cache = null;
})

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

