import React, { Component } from 'react';
import axios from 'axios';


class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      mes: '',
    };
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  confirmEmail(email) {
    axios.post(window.location.href, email)
    // axios.post('http://localhost:5000/confirmation/47d00acb3e553fef3856ae2bc97d58cd', {email: email})
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
        // new button with
        } else {
          this.setState({ mes: res.data.message });
        }
      });
    // close current window
  }


  render() {
    const { mes, email } = this.state;
    return (
      <div id="app">
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


    );
  }
}

export default Confirm;
