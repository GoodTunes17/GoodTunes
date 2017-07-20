// Include the axios package for performing HTTP requests (promise based alternative to request)

var request = require("request");

// Helper functions 
var helpers = {

        // Query your APIS -- these include parameters and a link to the NY times api - replace this with NPR - 

        runQuery: function() {
          console.log("in runQuery");
            var client_id = 'd69fbb5a57a64b94beae8a1866146356'; // Your client id
            var client_secret = '346ea81d095145afba6f862249b90b8c'; // Your secret

            // your application requests authorization
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                form: {
                    grant_type: 'client_credentials'
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {

                    // use the access token to access the Spotify Web API
                    var token = body.access_token;
                    var options = {
                        url: 'https://api.spotify.com/v1/search?q=new%20yorka&type=track&limit=1',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        json: true
                    };
                    request.get(options, function(error, response, body) {
                        console.log(body);
                    });
                }
            });

        },

        //this actualy scrapes - 

        scrape: function() {
            return axios.get("/scrape");
        },


        // this is getting the initial scrapes from the database

        getArticle: function() {
            return axios.get("/api");
        },

        // this will change the "saved" database property to true

        postArticle: function(result) {
            console.log("id is: " + result);
            return axios.post('/saved', { id: result });
        },

        // this will change the "saved" database property to false

        deleteArticle: function(result) {
            console.log("helper reached with " + result);
            return axios.post('/delete', { id: result });
        }
    };
    // We export the API helper
module.exports = helpers;
