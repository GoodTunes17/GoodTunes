// Include React
var React = require("react");
// Including the Link component from React Router to navigate within our application without full page reloads
var Link = require("react-router").Link;

var axios = require("axios");


var Rating = require('react-rating');

var helpers = require("../utils/helpers");
import styles from "./styles-children.css";
// Creating the Form component
var Scrape = React.createClass({

  // Here we set a generic state associated with the text being searched for
  getInitialState: function () {
    return {
      result: []

    };
  },

  //this places song in "saved" playlist
  handleClick1: function (result, e) {
    e.currentTarget.style.backgroundColor = '#8EFF80';
    this.props.savedArticles(result);
  },

  //this plays the song
  handleClick2: function (result, e) {
    console.log("play clicked for: " + result.title)
    this.props.playSong(result);
  },


  handleClick3: function (rate, search) {
    // this.props.callbackFn(key)
    var rating = [];
    console.log(rate._id); // this is the id
    console.log(search);  // this is the rating.. 
    rating.push(rate._id);
    rating.push(search);
    this.props.rating(rating);
  },


  // HERE we render the scraped info -  then send it to main.js
  render: function () {

    var url = "https://open.spotify.com/embed?uri=spotify:track:" + this.props.id;
    console.log(this.props.id);
    var rate = [];
    return (

      <div className="col-md-11" >

        {this.props.scrapedArticles.map(function (search, i) {
          var boundClick1 = this.handleClick1.bind(this, search);
          var boundClick2 = this.handleClick2.bind(this, search);
          var boundClick3 = this.handleClick3.bind(this, search);
          return (
            <div className="well">
              <p className="critic"> 
                <a href={search.sourceLink} target="blank">
                  <img className="logo" src={search.source}/> 
                </a>
                </p>
              <h4 className="artist"> <strong> {search.artist}</strong></h4>
              <p className="title">  {search.title} </p>
              <button className="btn save"  key={i} onClick={boundClick1}> save </button>
              <button className="btn play"  key={"a" + i} onClick={boundClick2}> play </button>
              <div className="rating">
                <Rating key={search.id} start={0} step={1} stop={5} initialRate={search.rating}
                  empty="glyphicon glyphicon-star-empty"
                  full="glyphicon glyphicon-star"
                  onClick={boundClick3} />
              </div>
            </div>
          );
        }.bind(this)
        )
        }

      </div>
    )

  }
})
// Export the component back for use in other files
module.exports = Scrape;
