// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

// AN API KEY
var apiKey = "9189e6ca2509411491bbcfd0a29c3ee9";

// Helper functions 
var helpers = {

  // Query your APIS -- these include parameters and a link to the NY times api - replace this with NPR - 

  runQuery: function (topic, beginYr, endYr) {


    var queryUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=9189e6ca2509411491bbcfd0a29c3ee9&q=" + topic + "&begin_date=" + beginYr + "&end_date=" + endYr;

    return axios.get(queryUrl).then(function (response) {

    })

  },

  //this actualy scrapes - 

  scrape: function () {
    return axios.get("/scrape")
  },


  // this is getting the initial scrapes from the database

  getArticle: function () {
    return axios.get("/api");
  },

  // this will change the "saved" database property to true

  postArticle: function (result) {
    console.log("id is: " + result)
    return axios.post('/saved',
      { id: result });
  },

  // this will change the "saved" database property to false

  deleteArticle: function (result) {
    console.log("helper reached with " + result)
    return axios.post('/delete',
      { id: result });
  }
}
// We export the API helper
module.exports = helpers;
