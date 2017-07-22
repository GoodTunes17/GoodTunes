// Include React
var React = require("react");

// Creating the Results component
var Playlist = React.createClass({
  // Here we render the function

  getInitialState: function () {
    return {

    }
  },
  componentWillReceiveProps: function (nextProps) {

  },

  // this is to play a song

  handleClick2: function (result, e) {
    console.log("play clicked for: " + result.title)
this.props.playSong(result);
  },

  // this will delete song from saved playlist

  handleClick3: function (result, e) {
    console.log("delete!")
    this.props.deletedArticle(result);
  },



  //  var articles = this.props.results.map(function (article, index) {

  render: function () {
const body={"background-color": "#B1D2D2"}
    return (

      <div>
      

        {this.props.playlist.map(function (search, i) {
          var boundClick3 = this.handleClick3.bind(this, search);
          var boundClick2 = this.handleClick2.bind(this, search);
          return (
            <div style={body}>
              <p> ARTIST: {search.artist} - SONG: {search.title}</p>
              <button key={"b" + i} onClick={boundClick3}> delete </button>
              <button key={"a" + i} onClick={boundClick2}> play </button>
              <div class="rating"> Rate:
                <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
              </div>
              <p> _________________________________</p>
            </div>
          )
        }.bind(this)
        )
        }
      </div>
    )

  }
})

// Export the component back for use in other files
module.exports = Playlist;
