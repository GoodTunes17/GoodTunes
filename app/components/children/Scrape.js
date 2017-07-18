// Include React
var React = require("react");

// Creating the Form component
var Scrape = React.createClass({

  // Here we set a generic state associated with the text being searched for
  getInitialState: function () {
    return {

    };
  },

  // This function will respond to the user input
  handleChange: function (event) {

  },

  // When a user submits...
  handleSubmit: function (event) {

  },

  handleClick1: function (result, e) {
    console.log("Clicked! " +
      result._id + "  " +
      result.title
    );
    this.props.savedArticles(result);
  },

  // HERE we render the scraped info -  then send it to main.js

  render: function () {
    return (

      <div>
        {this.props.scrape.map(function (search, i) {
          var boundClick1 = this.handleClick1.bind(this, search);
          return (
            <div>
              <p> ARTIST: {search.artist} - SONG: {search.title}</p>
              <button key={i} onClick={boundClick1}> save </button>
              <div class="rating"> Rate: 
                <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
              </div>
              <p> _________________________________</p>
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
