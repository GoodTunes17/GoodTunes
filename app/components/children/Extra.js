// Include React
var React = require("react");



// This is the History component. It will be used to show a log of  recent searches.
var Extra = React.createClass({

	 handleClick1: function (result, e) {
    this.props.login(result);
  },
  // Here we describe this component's render method
  render: function () {
 var boundClick1 = this.handleClick1.bind(this, search);

    return (

        <div className="container">

  	<h1>Enter your information in order to login:</h1>
 

    <form action="/login" method="post">
	  <div className="form-group">
	    <label for="email">Email address</label>
	    <input type="email" class="form-control" id="email" name="email" placeholder="Email" required> </input>
	  </div>
	  <div className="form-group">
	    <label for="password">Password</label>
	    <input type="password" className="form-control" id="password" name="password" placeholder="Password" required></input>
	  </div>
	  <button type="submit" className="btn btn-default" onClick={boundClick1}>Login</button>
	</form>

	<h4>Don't have an account? <a href="/signup">Sign up here!</a></h4>

  </div>
    );
  }
});

// Export the component back for use in other files
module.exports = Extra;
