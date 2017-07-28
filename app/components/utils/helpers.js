// Include the axios package for performing HTTP requests (promise based alternative to request)

var axios = require("axios");

// Helper functions 
var helpers = {

    //this actualy scrapes - 

    scrape: function() {
        return axios.get("/scrape");
        //  .then(function(response) {
        //      console.log("helper -- " + response)
        //     })
   
    },



    getArticle: function() {
        console.log("helpers.getarticle");
        return axios.get("/api");
        // .then(function(response) {
        //     console.log("helpers response - " + response.data)
        //     })
    },
// the old rating system - 
//    rating: function (result) {
//     console.log("id - " + result[0])
//       console.log("rating -- " +result[1])
//     return axios.post("/rating/"+result[0], {
//         name: result[1]
//     })
          
//   },

    rating: function (result) {
      console.log("id - " + result[0]);
      console.log("rating -- " +result[1]);
      return axios.post("/rating/", {
        id: result[0],
        rating: result[1]
    });
          
  },
    // this is getting the initial scrapes from the database

 

    // this will change the "saved" database property to true

    postArticle: function(result) {
        console.log("id is: " + result);
        return axios.post('/saved', { id: result });
    },

    // this will change the "saved" database property to false

    deleteArticle: function(result) {
        console.log("helper reached with " + result);
        return axios.post('/delete', { id: result });
    },

    // Creating a new user from the signup page
    createUser: function(email, password) {
        return axios.post('/signup', {
            email: email,
            password: password
        });
    },

    // Logging in a user from the login page
    logIn: function(email, password) {
        return axios.post('/login', {
            email: email, 
            password: password
        });
    }


};
// We export the API helper
module.exports = helpers;
