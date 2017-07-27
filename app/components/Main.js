// Include React
var React = require("react");
var axios = require('axios');
// Including the Link component from React Router to navigate within our application without full page reloads
var Link = require("react-router").Link;
var Login = require("./children/Login");

import styles from "./styles.css";

// Here we include all of the sub-components
// var Scrape = require("./children/Scrape");
// var Playlist = require("./children/Playlist");


// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// Creating the Main component
var Main = React.createClass({

  //  All the scrapes are getting dumped into scrapedArticles array: 

  getInitialState: function () {
    return {
      scrapedArticles: [],
      playlist: [],
      id: "",
      // email: "",
      // password: ""
    };
  },

  // componentWillMount is called before the render method is executed. It is important to note that setting the state in this phase will not trigger a re-rendering.

  componentWillMount: function () {

   
    // var self = this;
 

    if (this.state.scrapedArticles.length < 1) {
      console.log("no scrapes")
      this.scrape()

    }
    this.getAllArticles();
  },

  // componentDidMount: function() {
  //   this.getAllArticles();
  // },
  shouldComponentUpdate: function () {
    return true

  },

 
  scrape: function () {

    helpers.scrape().then(function (response) {
      console.log("scraped!")
      this.setState({ scrapedArticles: response.data });
      console.log("save1")
      // nothing will happen in this zone... 
      //    
    }.bind(this))

    console.log("did scrape scrape?")

    this.getAllArticles()

  },

  getAllArticles: function () {
    console.log("getallarticles")
    helpers.getArticle().then(function (response) {
   
      console.log("getallarticles scrape from db: ", response.data);

      this.setState({ scrapedArticles: response.data });

      //if nothing is in the database, then scrape -- 
      if (response.data !== this.state.scrapedArticles) {
        console.log("save2")
        this.setState({ scrapedArticles: response.data });
      }
      this.getPlaylist()
    }.bind(this))
  },

  // this will run through the scrapedArticles, 
  // find those that are "saved" and put them in the 
  // "playlist" variable.. 

  getPlaylist: function () {
    var prePlaylist = [];
    for (var i = 0; i < this.state.scrapedArticles.length; i++) {
      if (this.state.scrapedArticles[i].saved) {
        console.log(this.state.scrapedArticles[i].saved)
        prePlaylist.push(this.state.scrapedArticles[i])
      }
    }
    this.setState({ playlist: prePlaylist })
    console.log("playlist = " + this.state.playlist[0]);
  },

  // this will change the "saved" database property to true

  savedArticles: function (result) {
    console.log("This will need to be saved: " + result.artist + "whose id is: " + result._id)
    helpers.postArticle(result._id).then(() => {
      this.getAllArticles()
    })
  },

  // this will change the "saved" database property to false

  deletedArticle: function (result) {
    console.log("delete!");
    console.log("This will need to be un-saved: " + result.artist + "whose id is: " + result._id)
    helpers.deleteArticle(result._id);
    this.getAllArticles();
    // shouldn't this refresh the saved articles? 
  },
  rating: function (result) {
    console.log("ratings - " + result)
    helpers.rating(result);
  },
  playSong: function (result) {
    console.log("main " + result.title);
    console.log("main " + result.artist)
    // var self = this;
    return axios.get("/spotify2/" + result.title + "/" + result.artist)
      .then(function (response) {
        var id = response.data;
        console.log("here - ", id); // ex.: { user: 'Your User'}
        this.setState({ id: id })

      }.bind(this))
    console.log("idhere", this.state.id)
  },

  // When a new user tries to log in 
  // componentDidUpdate: function () {
  //   helpers.logIn(this.email, this.password).then(function(data) {
  //     console.log(data);
  //   }.bind(this));

  // },
 

userInfo: function(result) {
  console.log("in main - email - " + result.email)
  console.log("in main - password - " + result.password);

//two approaches: 

// one - call helpers, which has axios

   helpers.logIn(result.email, result.password).then(function(data) {
      console.log(data);
    }.bind(this));


// two - just use axios here - 

//  return axios.get("/login", {
//    email: result.email, 
//    password: result.password
//   }).then(function (response) {
//         var yo = response;
//         console.log("here - ", yo); // ex.: { user: 'Your User'}
//       }.bind(this))
 
},

  // setEmail: function(email) {
  //   this.setState({email: email});
  //   console.log ("main email - " + this.state.email)
  // },
  // setPassword: function(password) {
  //   this.setState({password: password});
  // },
  // Here we render the function

  render: function () {
    var url = "https://open.spotify.com/embed?uri=spotify:track:" + this.state.id;


    var children = React.Children.map(this.props.children, function (child) { return React.cloneElement(child, { scrapedArticles: this.state.scrapedArticles, savedArticles: this.savedArticles, playSong: this.playSong, deletedArticle: this.deletedArticle, id: this.state.id, playlist: this.state.playlist, rating: this.rating, userInfo:this.userInfo }) }.bind(this))
    return (

      <div className="container">



        {/* NAV BAR */}

        <nav className="navbar navbar-default">
          <div className="navbar-header col-md-9">
            <h1>Good Tunes</h1>
            <h2>{this.props.user}</h2>
          </div>
          <Link to="/Scrape"><button className="btn btn-nav" onClick={this.scrape}> Show Scrape</button></Link>
          <Link to="/Playlist"><button className="btn btn-nav"> Show Playlist</button></Link>
          <Link to="/login"><button className="btn btn-nav"> Login</button></Link>
          <Link to="/signup"><button className="btn btn-nav"> Sign Up</button></Link>
        </nav>

        <div className="col-md-4">
          <iframe src={url}
            width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
        </div>

        {/* SCRAPED SONGS -  */}
        {/* scrapedArticles contain scraped articles / savedArticles contain articles that the user wants saved for his playlist */}

        <div className="panel panel-default col-md-8">
          <div className="panel-body">
            {/* <Scrape scrape={this.state.scrapedArticles} savedArticles={this.savedArticles} />*/}
            {/* YOU CAN INSERT THE NEXT CHILD HERE, POPULATING WITH THE API CALLS? */}
            {children}
            {/*{React.cloneElement(this.props.children, {scrape: this.state.scrape})}*/}
            {/*
   
                */}
            {/*<Login setEmail={this.setEmail} setPassword={this.setPassword} />*/}
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
