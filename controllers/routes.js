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
var keys = require("../keys");


module.exports = function(app) {

    // Main "/" Route. This will redirect the user to our rendered React application
    // app.get("/", function(req, res) {
    //     res.sendFile(path.join(__dirname, "../public/", "index.html"));
    // });

    // Route to be used for viewing the main page after logging in - currently goes to the 
    // index page even if a user isn't logged in due to React Router rendering
    app.get('/', isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            message: req.flash('userMessage'),
            user: req.user
        });
    });

    // Route to be used for viewing a specific user's homepage after logging in
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            message: req.flash('userMessage'),
            user: req.user
        });
    });

    // Function for determining if user is logged in, gets passed into the route above
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    app.get('/signup', function(req, res, next) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
        //  res.send({ message: req.flash('signupMessage') });

    });

    // Creating a new user
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/signup',
        failureFlash: true,
        successFlash: true
    }));

    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage'),
            successMessage: req.flash('successMessage')
        });
    });

    // User logging in
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    }));

    // User logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with request
        request("http://www.pitchfork.com/reviews/best/tracks/", function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Save an empty result object
            var result = {};
            //entry is an array of result objects? 
            var entry = [];
            $('ul.artist-list').each(function(i, element) {
                console.log("scraping");
                result.artist = $(element).children().text();
                var title = $(element).siblings().text();
                //replace double quotes with nothing!
                title = title.replace(/[\u201C\u201D]/g, '');
                result.title = title;
                result.source = "Pitchfork";

                //use Tracks model to create new entries
                entry.push(new Track(result));
                console.log(result);
            });
            // this saves the array of pushed objects from website
            for (var i = 0; i < entry.length; i++) {
                entry[i].save(function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(data);
                    }
                });
            }
        });
        request("http://www.hypem.com/stack/", function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Save an empty result object
            var result = {};
            //entry is an array of result objects? 
            var entry = [];
            $(".section-player h3").each(function(i, element) {
                console.log("scraping");
                result.artist = $(this).children(".artist").text();
                result.title = $(this).find(".base-title").text();
                result.source = "Hype Machine";
                //use Tracks model to create new entries
                entry.push(new Track(result));
                console.log(result);
            });
            // this saves the array of pushed objects from website
            for (var i = 0; i < entry.length; i++) {
                entry[i].save(function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(data);
                    }
                });
            }
        });
        request("http://www.npr.org/series/122356178/songs-we-love/", function(error, response, html) {
            var $ = cheerio.load(html);
            var result = {};
            // $("h2.title").each(function(i,element){
            //     result.artist = $(this).children("a");
            //     result.title = $(this).children("a");

            $("h2.audio-module-title").each(function(i, element) {
                var song = $(this).text().split(",");
                result.artist = song[0];
                result.title = song[1];
                // var title = song[1];
                // title = title.replace(/[\u2018\u2019]/g, "'");
                // result.title = title;

                result.source = "NPR";
                var entry = new Track(result);
                entry.save(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(doc);
                    }
                });
            });
        });
        // I think we should skip spin for now as the url changes weekly and we have to format the title to remove quotes and the name of the album

        // request("http://www.spin.com/2016/08/favorite-songs-of-the-week-joyce-manor-isaiah-rashad/", function(error, response, html) {
        //     var $ = cheerio.load(html);
        //     var result = {};

        //     $("strong").each(function(i, element) {
        //         var song = $(this).text().split(",");
        //         result.artist = song[0];
        //         result.title = song[1];

        //         result.source = "SPIN";
        //         var entry = new Track(result);
        //         entry.save(function(err, doc) {
        //           if (err) {
        //               console.log(err);
        //           }
        //             else {
        //               console.log(doc);
        //             }
        //         });
        //     });
        // });

        request("https://www.indieshuffle.com/new-songs", function(error, response, html) {
            var $ = cheerio.load(html);
            var result = {};

            $("span.title-dash").each(function(i, element) {
                var song = $(this).parent("h5").text();
                song = song.split(" - ");
                result.artist = song[0];
                result.title = song[1];
                result.source = "Indie Shuffle";
                var entry = new Track(result);
                entry.save(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(doc);
                    }
                });
            });
        });

    });

    //spotify query to get the spotify id# that we need to use in the iframe player
    app.get("/spotify2/:title/:artist", function(req, res) {
        //removing spaces in the title for the query
        var songName = req.params.title;
        songName = songName.replace(/ /gi, "%20");
        console.log("name of song in routes: " + songName);
        var requestUrl = "https://api.spotify.com/v1/search?q=" + songName + "&type=track&year=2017&limit=5";

        function runQuery() {
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

                    console.log("url --" + requestUrl);
                    // use the access token to access the Spotify Web API
                    var token = body.access_token;
                    var options = {
                        url: requestUrl,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        json: true
                    };
                    request.get(options, function(error, response, body) {
                       console.log(body.tracks.items[0].artists[0].name);
                        console.log(req.params.artist);
                        //checks to see if any of the 5 tracks returned include the one we are looking for
                        if (body.tracks.items[0].artists[0].name.includes(req.params.artist)){
                            console.log("it's the right song!");
                        }else if (body.tracks.items[1].artists[0].name.includes(req.params.artist)){
                            console.log("#2 is the right song!");
                        }else if (body.tracks.items[2].artists[0].name.includes(req.params.artist)){
                            console.log("#3 is the right song!");
                        }else if (body.tracks.items[3].artists[0].name.includes(req.params.artist)){
                            console.log("#4 is the right song!");
                        }else if (body.tracks.items[4].artists[0].name.includes(req.params.artist)){
                            console.log("#5 is the right song!");
                        }else{
                            console.log("can't find it!")
                        } 

                        var id = body.tracks.items[0].id;
                        console.log(id);
                        res.send(id);

                    });
                }
            });

        }
        runQuery();
    });
    // this grabs all the scrapes from the database --- 

    app.get("/api", function(req, res) {
        console.log("hello");
        // Find all results from the scrapedData collection in the db
        Track.find({}, function(error, found) {
            // Throw any errors to the console
            if (error) {
                console.log(error);
            } else {
                res.json(found);
            }
        });
    });

    // app.post("/saved/:id"), function(req, res) {
    app.post("/api/saved", function(req, res) {
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

    app.post("/saved", function(req, res) {
        console.log("this is the id to save: " + req.body.id);
        Track.findOneAndUpdate({ "_id": req.body.id }, { "saved": true })
            .exec(function(err, doc) {
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

    app.post("/delete", function(req, res) {
        Track.findOneAndUpdate({ "_id": req.body.id }, { "saved": false })
            .exec(function(err, doc) {
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

    app.post("/rating", function(req, res) {
                    console.log("route - " + req.body.id)
                    console.log(" name - " + req.body.rating)
        Track.findOneAndUpdate(
            { "_id": req.body.id }, 
            { "rating": req.body.rating })
            .exec(function(err, doc) {
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

    // creates a new note or replaces an existing note
app.post("/rating/:id", function(req, res) {
    // creates a new note and passes the req.body to the entry
    var newComment = new Note(req.body);
    console.log("in routes - " +req.body.name);
    // saves the new note the db
    newComment.save(function(error, doc) {
        console.log("doc.id -- " + doc.name )
        // logs any errors
        if (error) {
            console.log(error);
        } else {
            // uses the article id to find and update it's note
            Track.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                .populate("name")
                // executes the above query
                .exec(function(err, doc) {
                    // logs any errors
                    if (err) {
                        console.log(err);
                    } else {

                        // or sends the document to the browser
                        console.log("here -- " +doc);
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
