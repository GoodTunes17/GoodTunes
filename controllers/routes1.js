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
//var keys = require("../keys");
var dotenv = require('dotenv');
dotenv.load();

module.exports = function (app) {
    
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
                
                title = title.replace('Best New Track', '');
                title = title.replace('Read the Review', '');
                //remove everything inside of and including brackets!
                title = title.replace(/\[.*?\]/g, "");
                title = title.replace(/[\u201C\u201D]/g, '');

                result.title = title;
                result.source = "https://raw.githubusercontent.com/mariegadda/tunesimgs/master/pitchfork_logo.png";
                result.sourceLink = "http://www.pitchfork.com/reviews/best/tracks/";
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
                result.source = "https://raw.githubusercontent.com/mariegadda/tunesimgs/master/stack_fb.png";
                result.sourceLink = "http://www.hypem.com/stack/";
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
            $("h2.audio-module-title").each(function(i, element) {
                var song = $(this).text();
                // if song includes , means it includes artist and title
                if (song.includes(',') === true) {
                    song = song.replace(/'/g, '');
                    song = song.split(",");
                    song[1] = song[1].slice(1);
                    console.log("THIS IS THE NPR SONG " + song[1]);
                    result.artist = song[0];
                    result.title = song[1];

                    result.source = "https://raw.githubusercontent.com/mariegadda/tunesimgs/master/npr_logo_rgb.JPG";
                    result.sourceLink = "http://www.npr.org/series/122356178/songs-we-love/";
                    var entry = new Track(result);
                    entry.save(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(doc);
                        }
                    });
                }
            });
        });

        request("https://www.indieshuffle.com/new-songs", function(error, response, html) {
            var $ = cheerio.load(html);
            var result = {};

            $("span.title-dash").each(function(i, element) {
                var song = $(this).parent("h5").text();
                //song titles including feat don't work with our spotify api
                if (song.includes("feat.") === false) {
                    song = song.split(" - ");
                    result.artist = song[0];
                    result.title = song[1];

                    result.source = "https://raw.githubusercontent.com/mariegadda/tunesimgs/31ab5ea7639bcf8d329c4f392a8d47bcd9ec62d8/indie_shuffle_logo.png";
                    result.sourceLink = "https://www.indieshuffle.com/new-songs";
                    var entry = new Track(result);
                    entry.save(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(doc);
                        }

                    });
                }
            });
        });

    });

    //spotify query to get the spotify id# that we need to use in the iframe player
    app.get("/spotify2/:title/:artist", function(req, res) {
        //removing spaces in the title for the query
        var artist = req.params.artist;
        console.log(artist);
        artist = artist.replace(/ /gi, "%20");
        var songName = req.params.title;
        songName = songName.replace(/ /gi, "%20");
        songName = songName.replace(/,/gi, "%2C");
        console.log("name of song in routes: " + songName);
        var requestUrl = "https://api.spotify.com/v1/search?q=track:" + songName + "%20artist:" + artist + "&type=track&limit=1";

        function runQuery() {
            console.log("in runQuery");
            // your application requests authorization
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64'))
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

                        if (body.tracks === undefined || body.tracks.items[0] === undefined) {
                            console.log("broken");
                            var id = "#";
                            res.send(id);
                        } else {
                            var id = body.tracks.items[0].id;
                            console.log(id);
                            res.send(id);

                        }
                    });
                }
            });
        }
        runQuery();
    });


    // ---- 

};