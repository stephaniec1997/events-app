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
    };
  }

  updateInfo(key, e){
    const value = {};
    value[key] =  e.target.value;
    this.setState(value);
  }

  signUp(user){
    axios.post("http://localhost:5000/users/account/signup", user)
      .then( res => {
        if (res.data.success){
          this.props.createUser();
        } else {
          alert(res.data.message)
        }
      })
  }

  render() {
    const signUpParam = Object.keys(this.state).map((key) => {
      if (key !== "admin"){
      return (
        <div key={key}>
          {key}:
          <input type={key} key={key} value={this.state[key]} onChange={(e) => {this.updateInfo(key, e);}} />
        </div>
      );
    }
    return null;
    });

    return (
      <div>
        {signUpParam}
        <button onClick={() => {this.signUp(this.state)}}>SignUp</button>
      </div>
    );
  }
}

export default SignUp;
