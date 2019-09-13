import React, { Component } from 'react';
import axios from 'axios';


class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: null,
      admin: false,
      data: null,
    };

    this.signUp = this.signUp.bind(this);
  }

  updateInfo(key, e) {
    const value = {};
    value[key] = e.target.value;
    this.setState(value);
  }

  signUp(user) {
    if (this.state.username.length < 3) {
      this.setState({ data: { success: false, message: 'Username is not long enough. Must be 3 characters long.' }, password: '' });
    } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email.toLowerCase()))) {
      this.setState({ data: { success: false, message: 'You have entered an invalid email address!' }, password: '' });
    } else if (this.state.password.length < 5) {
      this.setState({ data: { success: false, message: 'Password is not long enough. Must be 5 characters long' }, password: '' });
    } else {
      axios.post('/confirmation', user)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.setState({ data: res.data, password: '' });
          // this.props.createUser();
          } else {
            this.setState({ data: res.data, password: '' });
          }
        });
    }
  }

  render() {
    const signUpParam = Object.keys(this.state).map((key) => {
      if ((key !== 'data') && (key !== 'admin')) {
        return (
          <div className="form-group" key={key}>
            <label>
              {key}
:
              {' '}
            </label>
            <input type={key} className="form-control" id={key} value={this.state[key]} onChange={(e) => { this.updateInfo(key, e); }} />
          </div>
        );
      }

      return null;
    });

    const goodAlert = (this.state.data && this.state.data.success) ? (
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Well done!</h4>
        <p>{this.state.data.message}</p>
      </div>
    ) : null;

    const badAlert = (this.state.data && !this.state.data.success) ? (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        {this.state.data.message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    ) : null;

    return (
      <div className="signin">
        {goodAlert}
        {badAlert}
        <h2>Sign Up</h2>
        {signUpParam}
        <button onClick={() => { this.signUp(this.state); }}>SignUp</button>
      </div>
    );
  }
}

export default SignUp;
