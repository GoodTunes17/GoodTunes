var express = require("express");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var path = require("path");
// Requiring our Note and Article models
// var db = require("../models");
var Note = require("../models/Note.js");
var Track = require("../models/Track.js");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Requiring passport for user authentication
var passport = require("passport");
// var keys = require("../keys");


module.exports = function (app) {

    // Main "/" Route. This will redirect the user to our rendered React application
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/", "index.html"));
    });
    
    app.get('/signup', function (req, res, next) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // Creating a new user
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    // User logging in
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // // Route to be used for viewing a specific user's homepage after logging in
    // app.get('/profile', isLoggedIn, function(req, res) {
    //     res.sendFile(path.join(__dirname, "../public/", "index.html"), {
    //         user: req.user
    //     });
    // });

    // // User logout
    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

    // function isLoggedIn(req, res, next) {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     }
    //     res.redirect('/');
    // }

    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        request("http://www.pitchfork.com/reviews/best/tracks/", function (error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Save an empty result object
            var result = {};
            //entry is an array of result objects? 
            var entry = [];
            $('ul.artist-list').each(function (i, element) {
                console.log("scraping")
                result.artist = $(element).children().text();
                result.title = $(element).siblings().text();
                //use Tracks model to create new entries
                entry.push(new Track(result));
                console.log(result);
            });
            // this saves the array of pushed objects from website
            for (var i = 0; i < entry.length; i++) {
                entry[i].save(function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(data);
                    }
                });
            }
        });
        // res.redirect("/");
        res.json(data);
    });


//get for the spotify API, need to connect to front end - grab song title from the button click in scrape.js
// ajax it back to /spotify, use it in the url query as req.body
app.get("/spotify", function (req, res){

        function runQuery () {
          console.log("in runQuery");

            // your application requests authorization
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (Buffer.from(keys.client_id + ':' + keys.client_secret).toString('base64'))
                },
                form: {
                    grant_type: 'client_credentials'
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {

                    // use the access token to access the Spotify Web API
                    var token = body.access_token;
                    var options = {
                        url: 'https://api.spotify.com/v1/search?q=new%20york&type=track&year=2017&limit=1',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        json: true
                    };
                    request.get(options, function(error, response, body) {
                       res.send(body);
                    });
                }
            });

        }
        runQuery();
});
    // this grabs all the scrapes from the database --- 

    app.get("/api", function (req, res) {
        console.log("hello");
        // Find all results from the scrapedData collection in the db
        Track.find({}, function (error, found) {
            // Throw any errors to the console
            if (error) {
                console.log(error);
            } else {
                res.json(found);
            }
        });
    });

// app.post("/saved/:id"), function(req, res) {
    app.post("/api/saved", function (req, res) {
        console.log("this is the id to save: " + req.body);
        // Tracks.findOneAndUpdate(
        //     { "_id": req.params.id },
        //     { "saved": true }
        // )
        //     .exec(function (err, doc) {
        //         // logs any errors
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             // or sends the document to the browser
        //             console.log(doc);
        //             res.send(doc);
        //         }
        //     });
    });
    // this will change the "saved" database property to true

    app.post("/saved", function (req, res) {
        console.log("this is the id to save: " + req.body.id);
        Track.findOneAndUpdate(
            { "_id": req.body.id },
            { "saved": true }
        )
        .exec(function (err, doc) {
            // logs any errors
            if (err) {
                console.log(err);
            } else {
                // or sends the document to the browser
                console.log(doc);
                res.send(doc);
            }
        });
    });

    // this will change the "saved" database property to false

    app.post("/delete", function (req, res) {
        Track.findOneAndUpdate(
            { "_id": req.body.id },
            { "saved": false }
        )
        .exec(function (err, doc) {
            // logs any errors
            if (err) {
                console.log(err);
            } else {
                // or sends the document to the browser
                console.log(doc);
                res.send(doc);
            }
        });
    });
    //close the module.exports(app) function
};
