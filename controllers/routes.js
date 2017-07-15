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


module.exports = function(app) {

    app.get("/", function(req, res) {
        Tracks.find(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                console.log("here's the doc" + doc);
                var hndlObject = doc;
                res.render("../views/index.handlebars", { hndlObject });
            }
        });
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
                result.artist = $(element).children().text();
                result.title = $(element).siblings().text(); 
               //use Tracks model to create new entries
                entry.push(new Tracks(result));
                console.log(result);
            });
                for (var i = 0; i < entry.length; i++) {
                    entry[i].save(function(err, data){
                        if (err){
                            console.log(err);
                        }else{
                            console.log(data);
                        }
                    });
                }
        });
        res.redirect("/");
    });



// so to save new tracks.... 

app.post("/saved/:id", function(req, res){
    console.log(req.params.id);
      Tracks.findOneAndUpdate({"_id": req.params.id }, {"saved": true })
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

app.get("/saved/:id,", function(req, res){
     Tracks.findOne({ "_id": req.params.id })
      .exec(function(error, doc) {
            // logs any errors
            if (error) {
                console.log(error);
            }
            // sends doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

app.get("/saved", function(req, res) {
    Tracks.find({"saved": "true"}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            console.log("here's the doc" + doc);
            var hndlObject = doc;
            res.render("../views/saved.handlebars", { hndlObject });
        }
    });
});

//remove a track from saved page
app.post("/remove/:id", function(req, res){
    console.log(req.params.id);
      Tracks.findOneAndUpdate({"_id": req.params.id }, {"saved": false })
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
app.post("/scrape/:id", function(req, res) {
    // creates a new note and passes the req.body to the entry
    var newComment = new Note(req.body);
    console.log(req.body);
    // saves the new note the db
    newComment.save(function(error, doc) {
        // logs any errors
        if (error) {
            console.log(error);
        } else {
            // uses the article id to find and update it's note
            Tracks.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                .populate("note")
                // executes the above query
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
        }
    });
});

app.get("/scrape/:id", function(req, res) {
    // queries the db to find the matching one in our db...
    Tracks.findOne({ "_id": req.params.id })
        // populates all of the notes associated with it
        .populate("note")
        // executes the query
        .exec(function(error, doc) {
            // logs any errors
            if (error) {
                console.log(error);
            }
            // sends doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

//get route for deleting a comment
app.get("/delete/:id", function (req, res) {
    Note.remove({"_id": req.params.id})
    .exec(function(error, doc){
          if (error) {
                console.log(error);
            }
            // sends doc to the browser as a json object
            else {
                res.json(doc);
            }
    });

});





//close the module.exports(app) function
};





