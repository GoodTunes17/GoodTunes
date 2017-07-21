// Include the Main React Dependencies
var React = require("react");
var ReactDOM = require("react-dom");

// Include the main Main Component
// var Main = require("./components/Main");

// This code here allows us to render our main component (in this case Main)
// ReactDOM.render(<Main />, document.getElementById("app"));

// Grabs the Routes
var routes = require("./config/routes2");

// Renders the contents according to the route page.
ReactDOM.render(routes, document.getElementById("app"));
