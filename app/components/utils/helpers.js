// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

// NyTimes API
var apiKey = "9189e6ca2509411491bbcfd0a29c3ee9";

// Helper functions for making API Calls
var helpers = {

  // This function serves our purpose of running the query to geolocate.
  runQuery: function (topic, beginYr, endYr) {


    var queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=9189e6ca2509411491bbcfd0a29c3ee9&q=" + topic + "&begin_date=" + beginYr + "&end_date=" + endYr;

    return axios.get(queryUrl).then(function (response) {

    })

  },

  getArticle: function () {
    return axios.get("/api");
  },
  // This function posts saved articles to our database.
  postArticle: function (a, b, c) {
    // postArticle: function (result) {

    return axios.post('/api/saved',
      {
        artist: a,
        song: b,
        album: c
      })

  }

}


// We export the API helper
module.exports = helpers;
