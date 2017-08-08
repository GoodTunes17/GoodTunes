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

    // this reads songs from db
    // but doesn't scrape - 
    
    getArticle: function() {
        console.log("helpers.getarticle");
        return axios.get("/api");
        // .then(function(response) {
        //     console.log("helpers response - " + response.data)
        //     })
    },


    // submit rating to notes
    rating: function (result) {
        console.log("id - " + result[0]);
        console.log("rating -- " +result[1]);
        console.log("email -- " + result[2]);
        return axios.post("/rating/"+result[0], {
            name: result[1],
            email: result[2]
        });
    },

 

    // save to playlist

    postArticle: function(result) {
        console.log("the user email is  " + result[0]);
        console.log("the song id is " + result[1]);
        return axios.post('/saved', { id: result });
    },

    // delete from playlist

    deleteArticle: function(result) {
        console.log("helper reached with " + result);
        return axios.post('/delete', { 
            email: result[0],
            song: result[1] 
        });
    },

    // Creating a new user from the signup page
    createUser: function(email, password) {
        return axios.post('/signup', {
            email: email,
            password: password
        })        
        .catch(function(error) {
            console.log(error);
        });
    },

    // Logging in a user from the login page
    login: function(email, password) {
        return axios.post('/login', {
            email: email, 
            password: password
        })
        .catch(function(error) {
            console.log(error);
        });
    },

    // User logout
    logout: function() {
        return axios.get('/logout').then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    }


};
// We export the API helper
module.exports = helpers;
