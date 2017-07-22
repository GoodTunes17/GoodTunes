// Include React
var React = require("react");
// Including the Link component from React Router to navigate within our application without full page reloads
var Link = require("react-router").Link;

var helpers = require ("../utils/helpers");

// Creating the Form component
var Scrape = React.createClass({

  // Here we set a generic state associated with the text being searched for
  getInitialState: function () {
    return { result:[]

    };
  },

  // This function will respond to the user input
  handleChange: function (event) {

  },

  // When a user submits...
  handleSubmit: function (event) {

  },

  //this places song in "saved" playlist

  handleClick1: function (result, e) {
    this.props.savedArticles(result);
  },

  //this plays the song

  handleClick2: function (result, e) {
    console.log("play clicked for: " + result.title)
  this.props.playSong(result);
  },
  // HERE we render the scraped info -  then send it to main.js

  render: function () {
const body={"background-color": "#B1D2D2"}

 
      return (

      <div style={body}>
        {this.props.scrapedArticles.map(function (search, i) {
          var boundClick1 = this.handleClick1.bind(this, search);
          var boundClick2 = this.handleClick2.bind(this, search);
          return (
            <div className = "col-md-6"style={body}>
              <p> <strong> {search.artist}</strong></p>
              <p>  {search.title}</p>
              <button key={i} onClick={boundClick1}> save </button>
              <button key={"a" + i} onClick={boundClick2}> play </button>
              <div class="rating"> Rate:
                <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
              </div>
              <iframe src="https://open.spotify.com/embed?uri=spotify:track:71T6ks7uNqlkSAHM2CDWnj"
                width="300" height="80" frameborder="0" allowtransparency="true"></iframe>
              <hr />
            </div>
          );
        }.bind(this)
        )
        }
     
      </div>
    )
  }
});
// Export the component back for use in other files
module.exports = Scrape;
