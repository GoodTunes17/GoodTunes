// Include React
var React = require("react");
// Including the Link component from React Router to navigate within our application without full page reloads
var Link = require("react-router").Link;

var Rating = require('react-rating');

var helpers = require("../utils/helpers");
import styles from "../styles.css";
// Creating the Form component
var Scrape = React.createClass({

  // Here we set a generic state associated with the text being searched for
  getInitialState: function () {
    return {
      result: []

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


  handleClick3: function(rate, search) {
    // this.props.callbackFn(key)
    var rating=[];
    console.log(rate._id); // this is the id
    console.log(search);  // this is the rating.. 
    rating.push(rate._id); 
    rating.push(search)
    this.props.rating(rating)
  },
 
  // HERE we render the scraped info -  then send it to main.js

  render: function () {
    const body = { "background-color": "#B1D2D2" }
//  const SVGIcon = (props) =>
//   <div>
//     <svg className={props.className}>
//       <use xlinkHref={props.href} />
//     </svg>
  // </div>;
    var url = "https://open.spotify.com/embed?uri=spotify:track:" + this.props.id;
    console.log(this.props.id)
    var rate=[];
    return (

      <div style={body}>
        <h2>   Scraped Playlist </h2>
        {this.props.scrapedArticles.map(function (search, i) {
          
          rate.push(Math.floor((Math.random() * 5) + 1))
     console.log(search.name)
          var boundClick1 = this.handleClick1.bind(this, search);
          var boundClick2 = this.handleClick2.bind(this, search);
          var boundClick3 = this.handleClick3.bind(this, search);
          return (
            
            <div className="col-md-6" style={body}>
              <p> <strong> {search.artist}</strong></p>
              <p>  {search.title}</p>
              <button key={i} onClick={boundClick1}> save </button>
              <button key={"a" + i} onClick={boundClick2}> play </button>
              <div>

                 <Rating key={search.id} start={0} step={1} stop={5} initialRate={search.rating}
                  //  empty={<SVGIcon href="#icon-star-empty" className="icon" />}
  // full={<SVGIcon href="#icon-star-full" className="icon" />}
                  onClick={boundClick3} />
              </div>
               

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
