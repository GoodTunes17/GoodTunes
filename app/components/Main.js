// Include React
var React = require("react");
var axios = require('axios');


// Here we include all of the sub-components
var Form = require("./children/Scrape");
var Results = require("./children/Playlist");
var History = require("./children/Extra");

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// Creating the Main component
var Main = React.createClass({

  // Here we set a generic state associated with the number of clicks
  // Note how we added in this history state variable
  getInitialState: function () {
    return {

    };
  },
  componentDidMount: function () {

  },
  // If the component changes (i.e. if a search is entered)...
  componentDidUpdate: function () {


  },

  getArticle: function () {

  },

  saveArticle: function (result) {

  },
  // This function allows childrens to update the parent.
  setTerm: function () {


  },
  // Here we render the function
  render: function () {
    return (
      <div>
      </div>
    )
  }
});

// Export the component back for use in other files
module.exports = Main;
