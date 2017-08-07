// Include React
var React = require("react");
var axios = require('axios');
// Including the Link component from React Router to navigate within our application without full page reloads
var Link = require("react-router").Link;
var Login = require("./children/Login");

import styles from "./styles.css";

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
      email: "",
      isLoggedIn: false,
      voteCheck: [], // {id: 0}
      message: ""
    };
  },

  // componentWillMount is called before the render method is executed.  

  componentWillMount: function () {

    // if there are no scrapes in the database, then scrape and read scrapes from database
    // otherwise, read scapes from database (this.getAllArticles() - 

    if (this.state.scrapedArticles.length < 1) {
      console.log("no scrapes");
      this.scrape();
      this.getAllArticles();
    }
    else {
      this.getAllArticles();
    }
  },

  // this may/not be functional - it merely re-reads the database if any changes occur

  shouldComponentUpdate: function () {
    return true;
    this.getAllArticles()
  },

  /// GENERAL FUNCTIONS ---> 
  /// SCRAPE / READ SONGS, VOTECHECK / RATE, PLAY SONGS. 

  // SCRAPE will scrape from websites and save the results to the database 

  scrape: function () {
    helpers.scrape().then(function (response) {
      console.log("scraped!");
      this.setState({ scrapedArticles: response.data });
      console.log("save1");
      // nothing will happen in this zone... 
      //    
      this.voteCheck();
    }.bind(this));
    console.log("did scrape scrape?");
    this.voteCheck();
  },

  //GETALLARTICLES - will read articles from database
  //without going thru the effort of rescraping for new tracks. 

  getAllArticles: function () {
    console.log("getallarticles");
    helpers.getArticle().then(function (response) {
      console.log("getallarticles scrape from db: ", response.data);
      this.setState({ scrapedArticles: response.data });
      //if nothing is in the database, then scrape -- 
      if (response.data !== this.state.scrapedArticles) {
        console.log("save2");
        this.setState({ scrapedArticles: response.data });
      }
      if (this.state.email.length>0) {
        this.playlist2();
      }
    }.bind(this))
    // this.playlist2() // Does this need to be here?
  },

  //VOTECHECK will check to see which songs a user has voted for - 
  // if a user has voted for a song, they shouldn't be able to revote for it.
  // this gets all the songs that the user has voted for and stores them in "voteCheck" state
  // then, it updates from the database (getAllArticles())

  voteCheck: function () {
    if (this.state.isLoggedIn === true) {
      console.log("here" + this.state.email);
      // var self = this;
      return axios.get("/voteCheck/" + this.state.email)
        .then(function (response) {
          var id = response.data;
          console.log("here!!! big - ", id[0].voted); // ex.: { user: 'Your User'}
          this.setState({ voteCheck: id[0].voted });
          this.getAllArticles();
        }.bind(this));
      this.getAllArticles();
    }
    else {
      console.log("not logged in")
    }
    this.getAllArticles();
  },

  // RATING - if the user rates a track, we're sent here
  // this will first check the voteCheck array to see  if they've rated the track before, 
  // if they haven't , then it gets the average rating from the database
  // it performs the calculus, and then posts the new rating to the database

  rating: function (result) {
    if (this.state.email.length>0){
    var songId = result[0];
    var rating = result[1];
    console.log("for " + this.state.email + " vote check looks like - " + this.state.voteCheck);
    console.log(" vote check -- is " + songId + "the same as " + this.state.voteCheck[0]);
    // for (var i = 0; i < this.state.voteCheck.length; i++) {
    //if songid is not in votecheck
    if (!this.state.voteCheck.includes(songId)) {
      console.log('NEW RATING by ' + this.state.email);
      //track.find songid, rating:1, votes: 1
      return axios.get("/rating/" + songId)
        //get that response
        .then(function (response) {
          var id = response.data;
          console.log("rating and votes - ", id);
          var avgRate = id[0].rating;
          var votes = id[0].votes;
          // this is the calculus for the new average
          var newAvg = (avgRate + ((rating - avgRate) / (votes)));
          votes++;
          return axios.post("/rateUpdate/" + newAvg + "/" + votes + "/" + songId).then(function (response) {
            //dropping .then(function...)
            return axios.post("/upVote/" + songId + "/" + this.state.email).then(function (response) {
              console.log("hit votecheck!!! win");
              this.voteCheck();
            }.bind(this))
            this.voteCheck();
          }.bind(this))
        }.bind(this))
    } // if 1
    else {
      console.log("ALREADY DONE! NOT REGISTERED");
      this.getAllArticles();
    }
    }
  },

  // PLAYSONG - if user clicks play, this will get the play info - 

  playSong: function (result) {
    console.log("main " + result.title);
    console.log("main " + result.artist);
    // var self = this;
    return axios.get("/spotify2/" + result.title + "/" + result.artist)
      .then(function (response) {
        var id = response.data;
        console.log("here - ", id); // ex.: { user: 'Your User'}
        this.setState({ id: id });

      }.bind(this))
    console.log("idhere", this.state.id);
  },

  /// USER LOGIN FUNCTIONS BELOW ----> 

  userLogin: function (result) {
    helpers.login(result.email, result.password).then(function (response) {
      // If the login post is not successful, render the login component with the error message
      if (response.data[0] !== "Success!") {
        this.setState({ message: response.data });
        this.props.history.push('/login');
      }
      // If the login is successful, render the playlist component with the welcome message
      else {
        this.setState({
          email: result.email,
          isLoggedIn: true
        });
        this.playlist2();
        this.props.history.push('/Playlist');
      }
    }.bind(this));
  },



  userSignup: function (result) {
    helpers.createUser(result.email, result.password).then(function (response) {
      // If the signup post is not successful, render the signup component with the error message
      if (response.data[0] !== "Success!") {
        this.setState({ message: response.data });
        this.props.history.push('/signup');
      }
      // If the signup is successful, log in the new user and render the playlist component 
      // with the welcome message
      else {
        this.setState({ email: result.email });
        this.setState({ isLoggedIn: true });
        this.props.history.push('/Playlist');
      }
    }.bind(this));
  },

  userLogout: function () {
    this.setState({
      email: "",
      isLoggedIn: false,
      playlist: []
    });
    helpers.logout().then(function (response) {
      console.log(response);
    }.bind(this));
  },

  /// PLAYLIST FUNCTIONS BELOW ----> 

  // this saves to playlist

  savedArticles: function (result) {

    // If no user is logged in then redirect to the login page
    if (this.state.isLoggedIn === false) {
      this.setState({ message: "Please login in order to save songs to your playlist." });
      this.props.history.push('/login');
    }
    // If a user is logged in then proceed with saving the song
    else {
      var play = [];
      var useremail = this.state.email;
      play.push(useremail);
      play.push(result._id);
      // play.push(result)

      console.log("sending this --  " + play);
      helpers.postArticle(play).then(() => {
        this.getAllArticles();
      });
    }
  },


  // this will delete a song from playlist. 

  deletedArticle: function (result) {
    console.log("delete!");
    console.log("This will need to be un-saved: " + result.artist + "whose id is: " + result._id);
    var remove = [];
    remove.push(this.state.email); // adds email to remove array
    remove.push(result._id); // adds song id to remove array
    helpers.deleteArticle(remove);
    this.getAllArticles();
    // shouldn't this refresh the saved articles? 
  },

  // This grabs songs for user playlist

  playlist2: function () {
    if (this.state.email.length>0) {
    var newPlaylist = [];
    //this uses the email address to get the user's playlist ids- 
    console.log("sending here - " + this.state.email);
    return axios.get("/playlist/" + this.state.email).then(function (data) {
      console.log(data);
      //this is the playlist
      newPlaylist = data.data[0].playlist;
      console.log("sending - " + newPlaylist);
 
      //if there's playlist present, then it uses these id's to get song info - 
      console.log("and here --- " + newPlaylist);
      if (newPlaylist.length>0) {
      return axios.get("/playlist2/" + newPlaylist).then(function (response) {
        console.log("new songs - " + response.data);
        this.setState({ playlist: response.data });
      }.bind(this));
      }
         }.bind(this));
    }
  // here 
    // this.getPlaylist();
  },

  // Here we render the function

  render: function () {
    if (this.state.id.length>0) {
    var url = "https://open.spotify.com/embed?uri=spotify:track:" + this.state.id;
    }

    var children = React.Children.map(this.props.children, function (child) { return React.cloneElement(child, { scrapedArticles: this.state.scrapedArticles, savedArticles: this.savedArticles, playSong: this.playSong, deletedArticle: this.deletedArticle, id: this.state.id, playlist: this.state.playlist, rating: this.rating, userLogin: this.userLogin, userSignup: this.userSignup, userLogout: this.userLogout, isLoggedIn: this.state.isLoggedIn, email: this.state.email, message: this.state.message }) }.bind(this))

    if (this.state.isLoggedIn === true) {
      var welcomeStatement = "Welcome, " + this.state.email + "!";
    }

    return (

      <div className="container">

        {/* NAV BAR */}

        <nav className="navbar navbar-default">
          <div className="navbar-header col-md-9">
            <h1>Good Tunes</h1>
            <h2>recommended tunes from around the internet!</h2>
            <h2>{welcomeStatement}</h2>
          </div>

          <Link to="/login"><a className="signup"> Login</a></Link>
          <Link to="/signup"><a className="signup"> Sign Up</a></Link>
          <Link to="/logout"><a className="signup"> Logout</a></Link>
          <Link to="/Scrape"><button className="btn btn-nav" onClick={this.scrape}> Get New Tunes</button></Link>
          <Link to="/Playlist" ><button className="btn btn-nav" onClick={this.playlist2}> Show Playlist</button></Link>
          <Link to="/Scrape" ><button className="btn btn-nav" onClick={this.getAllArticles}> Show Current Tunes</button></Link>


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
          </div>
        </div>
        <footer>
        </footer>
      </div>

    );
  }
});


// Export the component back for use in other files
module.exports = Main;