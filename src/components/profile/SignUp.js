import React, { Component } from 'react';
import axios from 'axios'

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      admin: false,
      data: null,
    };

    this.signUp = this.signUp.bind(this);
  }

  updateInfo(key, e){
    const value = {};
    value[key] =  e.target.value;
    this.setState(value);
  }

  signUp(user){
    // TODO: have alerts as bootstrap
    // verify a good email
    // verify a long enough password
    axios.post("http://localhost:5000/confirmation", user)
      .then( res => {
        if (res.data.success){
          alert(res.data.message);
          this.setstate({data: res.data, password:''});
          // this.props.createUser();
        } else {
          this.setState({data: res.data, password:''});
        }
      })
  }

  render() {
    const signUpParam = Object.keys(this.state).map((key) => {
      if ((key !== "data") && (key !== 'admin')){
      return (
        <div class="form-group" key={key}>
          <label>{key}: </label>
          <input type={key} class="form-control" id={key}  value={this.state[key]}onChange={(e) => {this.updateInfo(key, e);}} / >
        </div>
      );
    }

    return null;
    });

    const goodAlert = (this.state.data && this.state.data.success) ? (
      <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">Well done!</h4>
        <p>{this.state.data.message}</p>
      </div>
    ): null;
    
    const badAlert = (this.state.data && !this.state.data.success) ? (
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        {this.state.data.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    ): null;
    const testingdata = this.state.data ? (this.state.data.message): null;

    return (
      <div className="signin">
        {goodAlert}
        {badAlert}
        <h2>Sign Up</h2>
        {signUpParam}
        <button onClick={() => {this.signUp(this.state)}}>SignUp</button>
      </div>
    );
  }
}

export default SignUp;
