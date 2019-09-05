import React, { Component } from 'react';
import axios from 'axios'





class Confirm extends Component {
  constructor(){
    super();
    this.state ={
      email: '',
      mes:''
    }
    this.confirmEmail = this.confirmEmail.bind(this)
  }

  confirmEmail(email){
    axios.post(window.location.href, email)
    // axios.post('http://localhost:5000/confirmation/47d00acb3e553fef3856ae2bc97d58cd', {email: email})
    .then(res => {
      if (res.data.success) {
        alert(res.data.message);
        //new button with
      } else{
        this.setState({mes: res.data.message});
      }
    });
      // close current window
  }


  render() {

    return (
      <div id="app">
      <p>{this.state.mes}</p>
      <label>Email: </label>
      <input type='email' className="form-control" id='email'  value={this.state.email} onChange={(e) => {this.setState({email: e.target.value});}} / >
      <button className="button" onClick={() => { this.confirmEmail(this.state.email) }}>Confirm Email</button>
      </div>


    );
  }
}

export default Confirm;
