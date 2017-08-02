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
var User = require("../models/User.js")
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Requiring passport for user authentication
var passport = require("passport");
var keys = require("../keys");


module.exports = function (app) {

    ///// passport ---------------------------

    // Main page route
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, "../public/", "index.html"));
    });

    // Redirect for successful signup or login
    app.get('/profile', function(req, res) {
        res.send(req.flash('userMessage'));
    });

    // Redirect for unsuccessful signup
    app.get('/signup', function(req, res, next) {
        res.send(req.flash('signupMessage'));
    });

    // Creating a new user
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true,
        successFlash: true
    }));

    // Redirect for unsuccessful login
    app.get('/login', function(req, res) {
        res.send(req.flash('loginMessage'));
    });

    // User logging in
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    }));

    // User logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
        console.log("User logged out");
    });

    //TRACK MANAGEMENT ------------------------

    // this grabs all the scrapes from the database --- 

    app.get("/api", function (req, res) {
        console.log("hello");
        // Find all results from the scrapedData collection in the db
        // Track.find({$query: {}, $orderby:{"rating":-1} }, function (error, found) {
            Track.find({}).sort({"rating":-1}).exec(function (error, found) {
            // Throw any errors to the console
            if (error) {
                console.log(error);
            } else {
                console.log("sorted query " ,found)
                res.json(found);
            }
        });//there was a parenthesis here
    });

      
    // PLAYLIST ----------------------- save / unsave
    // this deletes a song from user.playlist
    app.post("/delete", function (req, res) {
        console.log("this is the user email: " + req.body.email);
        console.log("this is the id to save: " + req.body.song);
        User.update({ "email": req.body.email }, { $pull: { playlist: req.body.song } })
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


    // this pushes a song onto user.playlist

    app.post("/saved", function (req, res) {
        console.log("this is the user email: " + req.body.id[0]);
        console.log("this is the id to save: " + req.body.id[1]);
        User.update({ "email": req.body.id[0] }, { $push: { playlist: req.body.id[1] } })
            .exec(function (err, doc) {
                // logs any errors
                if (err) {
                    console.log(err);
                } else {
                    // or sends the document to the browser
                    console.log(doc);
                    res.json(doc);
                }
            });
    });


    // PLAYLIST ------------------------ THE NEW GRAB -

    // this searches user model by email and retrieves playlists

    app.get("/playlist/:email", function (req, res) {

        User.find({ "email": req.params.email }, { playlist: 1 })
            .exec(function (error, doc) {
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    console.log(doc.body)
                    res.json(doc);
                }

            })
    })


    // this uses the playlists ids to grab the tracks  

    app.get("/playlist2/:playlist", function (req, res) {
        // var playlist=[];
        playlist = req.params.playlist;
        console.log("here - " + playlist)
        // playlist= "597e2f68c83f5d5ba6723427"
        // for (var i=0; i<playlist.length; i++){
        Track.find({ "_id": { $in: playlist.split(/,/) } })
            // Track.find({ "_id": id })
            .exec(function (error, doc) {
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    console.log("play list - " + doc)
                    res.json(doc);
                }

            })

    })



    // RATINGS --- --------------------------

    ///1. deliver votecheck

    app.get("/voteCheck/:email", function (req, res) {
        console.log("email -- " + req.params.email);
        User.find({ "email": req.params.email }, { "voted": 1 })
            .exec(function (err, doc) {
                // logs any errors
                if (err) {
                    console.log(err);
                } else {
                    // or sends the document to the browser
                    console.log("vote check " + doc);
                    res.send(doc);
                }
            });
    })

    //2.  get rating and votes -- 

    app.get("/rating/:songId", function (req, res) {
        console.log("songId -- " + req.params.songId);
        Track.find(
            { "_id": req.params.songId },
            {
                rating: 1,
                votes: 1
            })
            .exec(function (err, doc) {
                // logs any errors
                if (err) {
                    console.log(err);
                } else {
                    // or sends the document to the browser
                    console.log("rating and votes from track " + doc);
                    res.send(doc);
                }
            });
    })
    // saves rating to Track - easy 

    app.post("/rating", function (req, res) {
        console.log("route - " + req.body.id)
        console.log(" name - " + req.body.rating)
        console.log(" email - " + req.body.email)
        Track.findOneAndUpdate(
            { "_id": req.body.id },
            {
                "email": req.body.email,
                "rating": req.body.rating
            })
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
        /// secondary.... 



    });
    app.post("/upVote/:songId/:email", function (req, res) {
        console.log("song - " + req.params.songId)
        console.log("email - " + req.params.email)
        User.findOneAndUpdate(
            { "email": req.params.email },
            { $push: 
                { voted: req.params.songId } 
            })
            .exec(function (err, doc) {
                // logs any errors
                if (err) {
                    console.log(err);
                } else {
                    // or sends the document to the browser
                    console.log(doc);
                    console.log("adding to votecheck!!!!!!");
                    res.send(doc);
                }
            });
    })

        app.post("/rateUpdate/:newAvg/:votes/:songId", function (req, res) {
            console.log("new Avg - " + req.params.newAvg);
            console.log("votes " + req.params.votes);
            console.log("songId - " + req.params.songId)
            Track.update(
                { "_id": req.params.songId },
                {
                    votes: req.params.votes,
                    rating: req.params.newAvg
                })
                .exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        // or sends the document to the browser
                        console.log(doc);
                        res.send(doc);
                    }
                });
        });


        // saves rating to notes.js

        // creates a new note or replaces an existing note
        app.post("/rating/:id", function (req, res) {
            // creates a new note and passes the req.body to the entry
            var newComment = new Note(req.body);
            console.log("in routes - " + req.body.name);
            // saves the new note the db
            newComment.save(function (error, doc) {
                console.log("doc.id -- " + doc.name)
                // logs any errors
                if (error) {
                    console.log(error);
                } else {
                    // uses the article id to find and update it's rating
                    Track.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                        .populate("name")
                        // executes the above query
                        .exec(function (err, doc) {
                            // logs any errors
                            if (err) {
                                console.log(err);
                            } else {

                                // or sends the document to the browser
                                console.log("here -- " + doc);
                                res.send(doc);
                            }
                        });
                }
            });
        });


        // 3. get a rating if in the note model 

        app.get("/articles/:id", function (req, res) {
            // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
            Article.findOne({ "_id": req.params.id })
                // ..and populate all of the notes associated with it
                .populate("name")
                // now, execute our query
                .exec(function (error, doc) {
                    // Log any errors
                    if (error) {
                        console.log(error);
                    }
                    // Otherwise, send the doc to the browser as a json object
                    else {
                        res.json(doc);
                    }
                });
        });






        //close the module.exports(app) function
    };