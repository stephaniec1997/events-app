import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      data: null,
    };

    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn(user) {
    // TODO: tell them if account works or not, or make them reset password

    // Post request to backend
    axios.post('/users/account/signin', user)
      .then((res) => {
        const { data } = res;
        if (data.success) {
          this.props.login(data.token);
          // this.setState({data: res.data});
        } else {
          this.setState({ data });
        }
      });
  }

  updateInfo(key, e) {
    const value = {};
    value[key] = e.target.value;
    this.setState(value);
  }

  render() {
    const { data } = this.state;
    const badAlert = (data && !data.success) ? (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        {data.message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    ) : null;
    const loginParam = Object.keys(this.state).map((key) => {
      if (key !== 'data') {
        return (

          <div className="form-group" key={key}>
            <label htmlFor={key}>
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

    return (
      <div className="signin">
        {badAlert}
        <h2>Log In</h2>
        {loginParam}
        <button type="submit" onClick={() => { this.onSignIn(this.state); }}>Login</button>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Login;
