var express = require('express');
var favicon = require('serve-favicon');

var app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));


app.use(express.urlencoded());

var methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use(require('./controllers/user'));


var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server started at ' + new Date() + ', on port ' + port + '!');
});

var User = require(__dirname + '/models/User');
var Villain = require(__dirname + '/models/Villain');

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////GET request handling (largely uncommented)/////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/"
    }
    console.log(log);

    User.getUsernames(function (users) {
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('index', {
            users: users
        });
    });


});

app.get('/about', function (request, response) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/about"
    }
    console.log(log);

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('about');

});
