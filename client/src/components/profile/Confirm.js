import React, { Component } from 'react';
import axios from 'axios';
import {
  Navbar,
} from 'react-bootstrap/';
import logo from '../../logo1.png';

class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      mes: '',
    };
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  // hits confirm account enpoint
  confirmEmail(email) {
    axios.put(window.location.href, email)
    // axios.post('http://localhost:5000/confirmation/47d00acb3e553fef3856ae2bc97d58cd', {email: email})
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          // new button with
          window.location = '/'; // close current window
        } else {
          this.setState({ mes: res.data.message });
        }
      });
  }


  render() {
    const { mes, email } = this.state;
    return (
      <div id="app">
        <Navbar bg="dark" className="heightChange">
          <Navbar.Brand
            className="center"
          >
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              id="logo"
              className="d-inline-block align-top"
            />
            <h3 className="logo"> Events</h3>
          </Navbar.Brand>
        </Navbar>
        <div className="container justify-content-md-center">
          <p>{mes}</p>
          <label htmlFor="email">
          Email:
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => { this.setState({ email: e.target.value }); }}
            />
          </label>
          <button type="button" className="button" onClick={() => { this.confirmEmail(email); }}>Confirm Email</button>
        </div>
      </div>
    );
  }
}

export default Confirm;
