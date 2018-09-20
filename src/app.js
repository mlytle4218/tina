var express  = require('express');
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)/
// var waitForMongo  = require('wait-for-mongo');
var cors = require('cors');

var app      = express();                               // create our app w/ express

console.log("starting off in app.js");

// configuration =================
mongoose.Promise = global.Promise;

var dbURI = 'mongodb://mongo/demoReel';
// mongoose.connect('mongodb://localhost/demoReel', { useMongoClient: true });
// mongoose.connect('mongodb://localhost/demoReel', function(err) {
mongoose.connect('mongodb://' + dbURI, function(err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected');
    }    
});
// CONNECTION EVENTS
// When successfully connected

// var dbURI = 'mongodb://localhost/demoReel';

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected hiya'); 
});

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


// app.use(cors(corsOptions));

// app.use(function(req, res, next) {

//     // Website you wish to allow to connect
//     res.header('Access-Control-Allow-Origin', '*');


//     // Request methods you wish to allow
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.header('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// })

app.use(cors(corsOptions));

// app.use(function(req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "*");
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });




// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'example.com');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// }
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
// app.use('/static', express.static('images'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var originsWhitelist = [
  'http://localhost:4201',      //this is my front-end url for development
   'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}

// app.use(cors(corsOptions));



// app.all('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });


console.log("in app.js");

var routes = require('./routes/router');
app.use('/api/', routes);

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendFile('./public/index.html', { root: __dirname }); // load the single view file (angular will handle the page changes on the front-end)
});



var port = 3000;
// var host = process.env.HOST || '0.0.0.0';

// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port '+ port);
});

// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//   originWhitelist: [],
//   requireHeaders: ['orogin', 'x-requested-with'],
//   removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//   console.log('Running CORS Anywhere on ' + host + ':' + port);
// })
