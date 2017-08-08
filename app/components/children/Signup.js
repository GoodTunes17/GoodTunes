var React = require('react');
import styles from "./styles-children.css";

var Signup = React.createClass({
  getInitialState: function() {
    return {
      email: "",
      emailError: "",
      password: "",
      passwordError: ""
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
  // client-side email/password validation
  validate: function() {
    var isError = false;
    var errors = {
      emailError: "",
      passwordError: ""
    };
    if (this.state.email.indexOf("@") === -1) {
      isError = true;
      errors.emailError = "Requires valid email";
      console.log("Error: ", errors);
    }
    if (this.state.password.length < 6) {
      isError = true;
      errors.passwordError = "Password needs to be at least 6 characters long";
      console.log("Error: ", errors);
    }
    this.setState({
      emailError: errors.emailError,
      passwordError: errors.passwordError
    });
    return isError;
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var err = this.validate();
    if (!err) {
      var user = {};
      user ={email: this.state.email, password: this.state.password};
      this.props.userSignup(user);
      this.setState({
        email: "",
        emailError: "",
        password: "",      
        passwordError: ""
      });
      console.log("user signed up -- ", this.state.email)
    }
    else {
      console.log("Error: ", this.state.emailError, this.state.passwordError);
    }
  },
  render: function() {
    return (
      <div class="container">

  	  	<h2>Sign up to save your favorite songs!</h2>
        <h3>Enter your information:</h3>

        <h4 className="message">{this.props.message}</h4>

  	    <form onSubmit={this.handleSubmit}>
  		  <div className="form-group">
  		    <label for="email" className="signup">Email address</label>
  		    <input type="email" className="form-control" id="email" name="email" placeholder="Email" onChange={this.updateEmail} required></input>
  		    <p>{this.state.emailError}</p>
        </div>
  		  <div class="form-group">
  		    <label for="password" className="signup">Password</label>
  		    <input type="password" className="form-control" value={this.state.password} id="password" name="password" placeholder="Password" onChange={this.updatePassword} required></input>
  		    <p>{this.state.passwordError}</p>
        </div>
        <br/>
  		  <button type="submit" className="btn btn-default login-btn">Sign Up</button>
  		</form>
  	  </div>
   
  	);
  }
});

module.exports = Signup;