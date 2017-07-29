var React = require('react');

var Logout = React.createClass({
  componentWillMount: function() {
  	this.props.userLogout();
  },
  render: function() {
  	return (
  	  <div className="container">
  	  	<h4>Please come back again soon!</h4>
  	  </div>
  	);
  }
});

module.exports = Logout;