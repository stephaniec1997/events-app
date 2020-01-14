import React, { Component } from 'react';
import axios from 'axios';


class SignUp extends Component {
  constructor(props) {
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

  updateInfo(key, e) {
    const value = {};
    value[key] = e.target.value;
    this.setState(value);
  }

  signUp(user) {
    const { username, email, password } = this.state;
    if (username.length < 3) {
      this.setState({ data: { success: false, message: 'Username is not long enough. Must be 3 characters long.' }, password: '' });
    } else if (!(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase()))) {
      this.setState({ data: { success: false, message: 'You have entered an invalid email address!' }, password: '' });
    } else if (password.length < 5) {
      this.setState({ data: { success: false, message: 'Password is not long enough. Must be 5 characters long' }, password: '' });
    } else {
      axios.post('/confirmation', user)
        .then((res) => {
          if (res.data.success) {
            this.setState({ data: res.data, password: '' });
          // this.props.createUser();
          } else {
            this.setState({ data: res.data, password: '' });
          }
        });
    }
  }

  render() {
    const { state } = this;
    const { data } = state;

    const signUpParam = Object.keys(state).map((key) => {
      if ((key !== 'data') && (key !== 'admin')) {
        return (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{`${key}: `}</label>
            <input
              type={key}
              className="form-control"
              id={key}
              value={state[key]}
              onChange={(e) => { this.updateInfo(key, e); }}
            />
          </div>
        );
      }

      return null;
    });

    const goodAlert = (data && data.success) ? (
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Well done!</h4>
        <p>{data.message}</p>
      </div>
    ) : null;

    const badAlert = (data && !data.success) ? (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        {data.message}
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
        <button type="submit" onClick={() => { this.signUp(state); }}>SignUp</button>
      </div>
    );
  }
}

export default SignUp;
