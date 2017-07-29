var React = require('react');

var Signup = React.createClass({
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
    console.log("in signup - Email: ", this.state.email);
    console.log("in signup - Password: ", this.state.password);
    var user = {};
    user ={email: this.state.email, password: this.state.password};
    this.props.userSignup(user);
    this.setState({
      email: "", 
      password: ""
    });
  },
  render: function() {
  return (
    <div class="container">

      <h1>Enter your information in order to register:</h1>

      <form onSubmit={this.handleSubmit}>
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" name="email" placeholder="Email" onChange={this.updateEmail} required></input>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" value={this.state.password} id="password" name="password" placeholder="Password" onChange={this.updatePassword} required></input>
      </div>
      <button type="submit" class="btn btn-default">Sign Up</button>
    </form>

    </div>
  );
  }
});

module.exports = Signup;