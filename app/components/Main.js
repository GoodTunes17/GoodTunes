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

  // componentWillMount is called before the render method is executed. It is important to note that setting the state in this phase will not trigger a re-rendering.

  componentWillMount: function () {
    if (this.state.scrapedArticles.length < 1) {
      console.log("no scrapes")
      this.scrape()
      this.getAllArticles();
    }
    this.getAllArticles();
  },

  // componentDidMount: function() {
  //   this.getAllArticles();
  // },
  shouldComponentUpdate: function () {
    return true

  },

  voteCheck: function () {
    if (this.state.isLoggedIn === true) {
    console.log("here" + this.state.email)
    // var self = this;
    return axios.get("/voteCheck/" + this.state.email)
      .then(function (response) {
        var id = response.data;
        console.log("here!!! big - ", id[0].voted); // ex.: { user: 'Your User'}
        this.setState({ voteCheck: id[0].voted })
        this.getAllArticles();
      }.bind(this))
    this.getAllArticles();

  }else{console.log("not logged in")}
},



  scrape: function () {
    helpers.scrape().then(function (response) {
      console.log("scraped!")
      this.setState({ scrapedArticles: response.data });
      console.log("save1")
      // nothing will happen in this zone... 
      //    
      this.voteCheck()
    }.bind(this))

    console.log("did scrape scrape?")

    this.voteCheck()

  },

  getAllArticles: function () {
    console.log("getallarticles")
    helpers.getArticle().then(function (response) {
      //this shuffle function is also called everytime you click save, not good UX,
      //would be better to get articles by most recently entered into database? 

      // function shuffle(array) {
      //     var m = array.length,
      //         t, i;
      //     // While there remain elements to shuffle…
      //     while (m) {
      //         // Pick a remaining element…
      //         i = Math.floor(Math.random() * m--);
      //         // And swap it with the current element.
      //         t = array[m];
      //         array[m] = array[i];
      //         array[i] = t;
      //     }
      //     return array;
      // }
      // response.data = shuffle(response.data);


      console.log("getallarticles scrape from db: ", response.data);
      this.setState({ scrapedArticles: response.data });
      //if nothing is in the database, then scrape -- 
      if (response.data !== this.state.scrapedArticles) {
        console.log("save2")
        this.setState({ scrapedArticles: response.data });
      }
      this.playlist2()
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

  rating: function (result) {
    var songId = result[0];
    var rating = result[1];
    console.log("for " + this.state.email + " vote check looks like - " + this.state.voteCheck)
    console.log(" vote check -- is " + songId + "the same as " + this.state.voteCheck[0])
    // for (var i = 0; i < this.state.voteCheck.length; i++) {
    //if songid is not in votecheck
    if (!this.state.voteCheck.includes(songId)) {
      console.log('NEW RATING')
      //track.find songid, rating:1, votes: 1
      return axios.get("/rating/" + songId)
        //get that response
        .then(function (response) {
          var id = response.data;
          console.log("rating and votes - ", id);
          var avgRate = id[0].rating;
          var votes = id[0].votes;
          var newAvg = (avgRate + ((rating - avgRate) / (votes)))
          votes++;
          return axios.post("/rateUpdate/" + newAvg + "/" + votes + "/" + songId).then(function (response) {
            //dropping .then(function...)
            return axios.post("/upVote/" + songId + "/" + this.state.email).then(function (response) {
              console.log("hit votecheck!!! win")
              this.voteCheck();


            }.bind(this))
          }.bind(this))

        }.bind(this))


      //do math for average
      //update songid rating and add one to vote

    } // if 1
    else {
      console.log("ALREADY DONE! NOT REGISTERED")
      this.getAllArticles();
    }

    // } // for


  },

  avgrate: function () {
    helpers.avgrate(result)
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

  playlist: function () {
    console.log("sending here - " + this.state.email)
    return axios.post("/playlist/" + this.state.email)
  },

  userSignup: function (result) {
    helpers.createUser(result.email, result.password).then(function(response) {
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


  ///  NEW  - SAVES PLAYLIST ITEM 

  savedArticles: function (result) {


    // console.log("This will need to be saved: " + result.artist + "whose id is: " + result._id)
    // If no user is logged in then redirect to the login page
    if (this.state.isLoggedIn === false) {
      this.setState({message: "Please login in order to save songs to your playlist."});
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

  // this will change the "saved" database property to false

  deletedArticle: function (result) {
    console.log("delete!");
    console.log("This will need to be un-saved: " + result.artist + "whose id is: " + result._id);
    var remove = [];
    remove.push(this.state.email) // adds email to remove array
    remove.push(result._id) // adds song id to remove array
    helpers.deleteArticle(remove);
    this.getAllArticles();
    // shouldn't this refresh the saved articles? 

  },

  // NEW - GRABS PLAYLIST

  playlist2: function () {
    var newPlaylist = [];
    console.log("sending here - " + this.state.email)
    return axios.get("/playlist/" + this.state.email).then(function (data) {
      console.log(data)
      newPlaylist = data.data[0].playlist;
      console.log("sending - " + newPlaylist)
      return axios.get("/playlist2/" + newPlaylist).then(function (response) {
        console.log("new songs - " + response.data)
        this.setState({ playlist: response.data })
      }.bind(this))
    }.bind(this));
    this.getPlaylist();
  },

  // Here we render the function

  render: function () {
    var url = "https://open.spotify.com/embed?uri=spotify:track:" + this.state.id;


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
          <Link to="/Scrape"><button className="btn btn-nav" onClick={this.scrape}> Show Scrape</button></Link>
          <Link to="/Playlist" onClick={this.playlist2}><button className="btn btn-nav"> Show Playlist</button></Link>

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

    )
  }
});


// Export the component back for use in other files
module.exports = Main;