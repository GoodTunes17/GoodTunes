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
    app.get('/user/signup', function(req, res, next) {
        res.sendFile(__dirname + '/signup.html');
    });

    // Not in use yet - work in progress
    app.post('/user/signup', passport.authenticate('local.signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
    }));

    // this grabs the scrapes AND saves them to the database

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
                result.artist = $(element).children().text();
                result.title = $(element).siblings().text();
                //use Tracks model to create new entries
                entry.push(new Track(result));
                console.log(result);
            });
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
        res.redirect("/");
    });

    // this grabs all the scrapes from the database --- 

    app.get("/api", function (req, res) {

        // Find all results from the scrapedData collection in the db
        Track.find({}, function (error, found) {
            // Throw any errors to the console
            if (error) {
                console.log(error);
            } else {
                res.json(found); 
                        }
                    });
            })
      

    //close the module.exports(app) function
};
