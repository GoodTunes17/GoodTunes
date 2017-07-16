var express = require("express");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var path = require("path");
// Requiring our Note and Article models
// var db = require("../models");
var Note = require("../models/Notes.js");
var Tracks = require("../models/Tracks.js");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


module.exports = function (app) {

    // Main "/" Route. This will redirect the user to our rendered React application
    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });


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
                entry.push(new Tracks(result));
                console.log(result);
            });
            for (var i = 0; i < entry.length; i++) {
                entry[i].save(function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
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
        Tracks.find({}, function (error, found) {
            // Throw any errors to the console
            if (error) {
                console.log(error);
            }
            // If there are no errors, send the data to the browser as a json
            else {
                res.json(found);
            }
        });
    });

    // so to save new tracks.... 

    // app.post("/saved/:id", function (req, res) {
    //     console.log(req.params.id);
    //     Tracks.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    //         .exec(function (err, doc) {
    //             // logs any errors
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 // or sends the document to the browser
    //                 console.log(doc);
    //                 res.send(doc);
    //             }
    //         });
    // });

    // app.get("/saved/:id,", function (req, res) {
    //     Tracks.findOne({ "_id": req.params.id })
    //         .exec(function (error, doc) {
    //             // logs any errors
    //             if (error) {
    //                 console.log(error);
    //             }
    //             // sends doc to the browser as a json object
    //             else {
    //                 res.json(doc);
    //             }
    //         });
    // });



    // //remove a track from saved page
    // app.post("/remove/:id", function (req, res) {
    //     console.log(req.params.id);
    //     Tracks.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
    //         .exec(function (err, doc) {
    //             // logs any errors
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 // or sends the document to the browser
    //                 console.log(doc);
    //                 res.send(doc);
    //             }
    //         });
    // });

    // // creates a new note or replaces an existing note
    // app.post("/scrape/:id", function (req, res) {
    //     // creates a new note and passes the req.body to the entry
    //     var newComment = new Note(req.body);
    //     console.log(req.body);
    //     // saves the new note the db
    //     newComment.save(function (error, doc) {
    //         // logs any errors
    //         if (error) {
    //             console.log(error);
    //         } else {
    //             // uses the article id to find and update it's note
    //             Tracks.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
    //                 .populate("note")
    //                 // executes the above query
    //                 .exec(function (err, doc) {
    //                     // logs any errors
    //                     if (err) {
    //                         console.log(err);
    //                     } else {
    //                         // or sends the document to the browser
    //                         console.log(doc);
    //                         res.send(doc);
    //                     }
    //                 });
    //         }
    //     });
    // });

    // app.get("/scrape/:id", function (req, res) {
    //     // queries the db to find the matching one in our db...
    //     Tracks.findOne({ "_id": req.params.id })
    //         // populates all of the notes associated with it
    //         .populate("note")
    //         // executes the query
    //         .exec(function (error, doc) {
    //             // logs any errors
    //             if (error) {
    //                 console.log(error);
    //             }
    //             // sends doc to the browser as a json object
    //             else {
    //                 res.json(doc);
    //             }
    //         });
    // });

    // //get route for deleting a comment
    // app.get("/delete/:id", function (req, res) {
    //     Note.remove({ "_id": req.params.id })
    //         .exec(function (error, doc) {
    //             if (error) {
    //                 console.log(error);
    //             }
    //             // sends doc to the browser as a json object
    //             else {
    //                 res.json(doc);
    //             }
    //         });

    // });





    //close the module.exports(app) function
};





