// Include the React library
var React = require("react");

// Include the react-router module
var router = require("react-router");

// Include the Route component for displaying individual routes
var Route = router.Route;

// Include the Router component to contain all our Routes
// Here where we can pass in some configuration as props
var Router = router.Router;

// Include the hashHistory prop to handle routing client side without a server
// https://github.com/ReactTraining/react-router/blob/master/docs/guides/Histories.md#hashhistory
var hashHistory = router.hashHistory;

// Include the IndexRoute (catch-all route)
var IndexRoute = router.IndexRoute;

// Reference the high-level components
var Main = require("../components/Main");
var Signup = require("../components/children/Signup");
var Login = require("../components/children/Login");
var Scrape = require("../components/children/Scrape");
var Playlist = require("../components/children/Playlist");
var Extra = require("../components/children/Extra");
var Logout = require("../components/children/Logout");

function loggedIn() {
  return true;
}

function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login'
    });
  }
}

// Export the Routes
module.exports = (

  // The high level component is the Router component
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
   

      {/* Show the appropriate component based on the user selection */}
      <Route path="Scrape" component={Scrape} />
      <Route path="Playlist" component={Playlist} onEnter={requireAuth} />
      <Route path="signup" component={Signup} />
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
     

      {/* If user selects any other path... we get the scrape Route */}
      <IndexRoute component={Scrape} />

    </Route>
  </Router>

);
