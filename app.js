var express = require('express');
var routes = require('./routes/all.js');

var http = require('http');
var path = require('path');
var cons = require('consolidate')

var app = express();


app.engine('dust', cons.dust);
cons.dust.helpers = require('dustjs-helpers');

app.set('port', process.env.PORT || 3000);
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
    src: __dirname + '/resources/',
    dest: __dirname + '/public/',
    debug: true,
    force: true,
    compile: function compile(str, path) {
        return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(axis(),jeet(),nib(),rupture(),typographic())
    }
}));

app.get('/pages/:page', routes.pages);
app.get('/',function(req,res){
    res.redirect('/pages/chart');
})

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

