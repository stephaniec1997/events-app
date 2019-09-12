import React, { Component } from 'react';
import axios from 'axios'

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      data: null
    };

    this.onSignIn = this.onSignIn.bind(this);
  }

  updateInfo(key, e){
    const value = {};
    value[key] =  e.target.value;
    this.setState(value);
  }

  onSignIn(user) {
    // TODO: tell them if account works or not, or make them reset password

    // Post request to backend
    axios.post("http://localhost:5000/users/account/signin", user)
      .then(res => {
        if (res.data.success) {
          this.props.login(res.data.token);
          // this.setState({data: res.data});


        } else{
          this.setState({data: res.data});
        }
      });
  }

  render() {
    const badAlert = (this.state.data && !this.state.data.success) ? (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        {this.state.data.message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    ): null;
    const loginParam = Object.keys(this.state).map((key) => {
      if (key !== "data"){
      return (

        <div className="form-group" key={key}>
          <label>{key}: </label>
          <input type={key} className="form-control" id={key}  value={this.state[key]}onChange={(e) => {this.updateInfo(key, e);}} / >
        </div>
      );
    }
    return null;
    });

    return (
      <div className="signin">
      {badAlert}
        <h2>Log In</h2>
        {loginParam}
        <button onClick={() => {this.onSignIn(this.state);}}>Login</button>
      </div>
    );
  }
}

export default Login;
