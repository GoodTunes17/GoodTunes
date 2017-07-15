// ==============Dependencies=============================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
//Require handlebars
var exphbs = require("express-handlebars");
var handlebars = require("handlebars");
// Requiring our Note and Article models
var Note = require("./models/Notes.js");
var Tracks = require("./models/Tracks.js");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;
// ========SERVER AND DB SETUP============================

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


// Make public a static directory
app.use(express.static("public"));

// Database configuration for heroku deploy or local
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pitchfork");

var db = mongoose.connection;

// Show any mongoose errors
db.on('error', console.error.bind(console, 'connection error:'));

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// use handlebars
app.engine("handlebars", exphbs({extname: "handlebars", defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ============ROUTES===============================================

require("./controllers/routes.js")(app);

// ============= Listen on PORT===========================
app.listen(PORT, function() {
    console.log("App running on " + PORT);
});
