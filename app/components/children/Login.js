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
    console.log("in login - Email: ", this.state.email);
    console.log("in login - Password: ", this.state.password);
    var user = {}
    user ={email: this.state.email, password: this.state.password}
    this.props.userInfo(user);
    // this.setState({
    //   email: "", 
    //   password: ""
    // });
  },
  render: function() {
  	return (
  	  <div className="container login">

  	    <h2>Enter your information to login:</h2>

  	    <form onSubmit={this.handleSubmit}>
    		  <div className="form-group">
    			  <label for="email" className="signup">Email address</label>
    			  <input type="email" className="form-control" id="email" name="email" placeholder="Email" onChange={this.updateEmail} required></input>
    	    </div>
    	    <div className="form-group">
      			<label for="password" className="signup">Password</label>
      			<input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={this.updatePassword} required></input>
    		  </div>
    		  <button type="submit" className="btn btn-default login-btn">Login</button>
  	    </form>

  	  </div>
  	);
  }
});

module.exports = Login;