// Include React
var React = require("react");
var axios = require('axios');


// Here we include all of the sub-components
var Scrape = require("./children/Scrape");
// var Results = require("./children/Playlist");
// var History = require("./children/Extra");

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// Creating the Main component
var Main = React.createClass({

  //  All the scrapes are getting dumped into scrapedArticles array: 

  getInitialState: function () {
    return {
      scrapedArticles: [], savedArticles: []
    };
  },

  // When the page loads, we run the helpers.getArticle function
  // this function populates the scrapedArticles variable with the scrapes in the database
  // since savedArticles is a "state" variable, it will render in the first child, called "Scrape"

  componentDidMount: function () {

    helpers.getArticle().then(function (response) {

      console.log("The scrapes: ", response.data);

      this.setState({ scrapedArticles: response.data });

    }.bind(this));
  },

  savedArticles: function (result) {
    console.log("This will need to be saved: " + result.artist)
  },


  componentDidUpdate: function () {

    // What happens if something updates? 

  },


  setTerm: function () {
    // This function allows childrens to update the parent.

  },

  // Here we render the function

  render: function () {

    const style = { width: '70%' };
    const width = { width: '15%' };
    const body = { 'background-color': 'yellow', border: '1px solid black', float: 'right' }

    return (

      <div>
        <h1>Good Tunes</h1>

        {/* NAV BAR */}

        <nav>
          <div>
            <a href="#" class="brand-logo"><h2>Pitchfork Scraper</h2></a>
            <ul className="nav nav-tabs" >
              <li className="active"> <a href="#">Home</a></li>
              <li><a href="#">By Genre</a></li>
              <li><a href="#">By Critic</a></li>
              <li><a href="#">By Rating</a></li>
              <li><a href="#">Saved Tracks</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </div>
        </nav>
        <div>


          {/* SCRAPED SONGS -  */}
          {/* scrapedArticles contain scraped articles / savedArticles contain articles that the user wants saved for his playlist */}

          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title text-center">Scrapes</h3>
            </div>
            <div className="panel-body text-center">

              <Scrape scrape={this.state.scrapedArticles} savedArticles={this.savedArticles} />

              {/* YOU CAN INSERT THE NEXT CHILD HERE, POPULATING WITH THE API CALLS? */}


            </div>
          </div>
        </div>

        <footer>

        </footer>

      </div>

    )
  }
});

// Export the component back for use in other files
module.exports = Main;
