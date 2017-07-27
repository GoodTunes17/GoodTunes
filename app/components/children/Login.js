var React = require('react');

var Login = React.createClass({
  getInitialState: function() {
  	return {
  	  email: "",
  	  password: ""
  	};
  },
  updateEmail: function(event) {
    event.preventDefault();
    this.setState({
      email: event.target.value
    });
  },
  updatePassword: function(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    console.log("Email: ", this.state.email);
    console.log("Password: ", this.state.password);
    this.props.setEmail(this.state.email);
    this.props.setPassword(this.state.password);
    this.setState({
      email: "",
      password: ""
    });
  },
  render: function() {
  	return (
  	  <div class="container">

  	    <h1>Enter your information in order to login:</h1>

  	    <form onSubmit={this.handleSubmit}>
    		  <div class="form-group">
    			  <label for="email">Email address</label>
    			  <input type="email" class="form-control" id="email" name="email" placeholder="Email" onChange={this.updateEmail} required></input>
    	    </div>
    	    <div class="form-group">
      			<label for="password">Password</label>
      			<input type="password" class="form-control" id="password" name="password" placeholder="Password" onChange={this.updateEmail} required></input>
    		  </div>
    		  <button type="submit" class="btn btn-default">Login</button>
  	    </form>

  		  <h4>Don't have an account? <a href="/signup">Sign up here!</a></h4>

  	  </div>
  	);
  }
});

module.exports = Login;