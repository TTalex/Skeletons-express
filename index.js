config = require('./config');
// get all the tools we need
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

// Enable CORS requests
// http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

if (app.get('env') === "development") {
    var morgan       = require('morgan');
    app.use(morgan('dev')); // log every request to the console
} else {
    console.log = function () {};
}


// http://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser({limit: '50mb'})); // get information from html forms


 // load our routes
require('./app/routes.js')(app);

// Launch
server = https.createServer({
        key: fs.readFileSync('certs/device.key'),
        cert: fs.readFileSync('certs/device.crt')
}, app);
server.listen(port);
console.log('The magic happens on port ' + port);
