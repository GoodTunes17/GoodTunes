// ==============Dependencies=============================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Track = require("./models/Track.js");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Requiring Passport configuration for sign-in
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");

var PORT = process.env.PORT || 3000;
// ========SERVER AND DB SETUP============================

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(session({
  secret: 'secrettunes',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(express.static("public"));

var MONGODB_URI = "mongodb://heroku_kr96vmr5:mj91etrj8bmntsq1ni6cqd915r@ds129043.mlab.com:29043/heroku_kr96vmr5";
// Database configuration for heroku deploy or local
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/tunes");

var db = mongoose.connection;
require ("./controllers/config/passport.js");

// Show any mongoose errors
db.on('error', console.error.bind(console, 'connection error:'));

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// ============ROUTES===============================================

require("./controllers/routes.js")(app);
require("./controllers/routes1.js")(app);
// require("./app/config/routes2.js")(app);

// ============= Listen on PORT===========================
app.listen(PORT, function() {
    console.log("App running on " + PORT);
});
