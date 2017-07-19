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
var csrf = require("csurf");
var csrfProtection = csrf();


module.exports = function (app) {

    // Main "/" Route. This will redirect the user to our rendered React application
    app.get("/", function (req, res) {
        if (error) {
            console.log(error);
        }
        else {
            res.sendFile(__dirname + "/public/index.html");
        }
    });

    // Temporarily redirecting to index
    app.get('/user/signup', function (req, res, next) {
        var messages = req.flash('error');
        res.sendFile(__dirname + '/signup.html');
        //, {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}
    });

    // Not in use yet - work in progress
    app.post('/user/signup', passport.authenticate('local.signup', {
        successRedirect: '/',
        failureRedirect: 'user/signup',
        failureFlash: true
    }));

    app.get('/user/login', function (req, res) {
        var messages = req.flash('error');
        res.sendFile(__dirname + '/signup.html');
        //, {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}
    });

    app.post('/user/login', passport.authenticate('local.login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));


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



    // this grabs all the scrapes from the database --- 

    app.get("/api", function (req, res) {
        console.log("hello")
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


    })
    //close the module.exports(app) function
};
