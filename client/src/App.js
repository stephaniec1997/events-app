import React, { Component } from 'react';
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"
// import { BrowserRouter as Router, Route} from "react-router-dom";
import logo from './logo1.png';
import './App.css';
import { setInStorage, getFromStorage, } from './utils/storage';

import EventsContainer from './components/events/EventsContainer';
import EventEditor from './components/events/EventEditor';
import SignUp from './components/profile/SignUp';
import Login from './components/profile/Login';

import AdminList from './components/profile/admin/AdminList';



class App extends Component {
  constructor(){
    super();
    this.state = {
      menu: false,
      editor: false,
      signUp: false,
      changeAdmin:false,
      event: null,
      collection: [],
      token:'',
      admin:false,
    };

    this.handleSave = this.handleSave.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.createUser = this.createUser.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount(){
    //LOAD EVENTS
    axios.get("/events/")
      .then(response => {

        this.setState({
          collection: response.data
        })
        let sortedData = this.state.collection
        sortedData = sortedData.sort((a, b) => {
          if ( a.startDate > b.startDate){
            return 1;
          } else if ((a.startDate) < (b.startDate)){
            return -1;
          }
          return 0;
          });
          this.setState({collection: sortedData});

        // TODO: Do not display those that have passed
      })
      .catch((error) => {
        console.log(error);
      })

    // SORT EVENTS



    // GET/VERIFY TOKEN
    const obj = getFromStorage('events-app');
    if (obj && obj.token) {
      const token = obj.token;
      // Verify token
      axios.get("/users/account/verify/" + token)
        .then(res =>{
          console.log(res.data)
          if (res.data.success) {
            this.setState({
              token: token,
            });
            if (res.data.message) {
              this.setState({
                admin: true,
              });
              }
          }
        });
    }
  }

  handleSave(newEvent){
    if (newEvent){
      if (this.state.event){
        this.updateEvent(newEvent);
      }else{
        this.addEvent(newEvent);
      }
    }
    this.setState({ editor: false, menu: false, event:null, changeAdmin:false});
  }

  addEvent(newEvent){
    axios.post("/events/add", newEvent)
      .then(res => {
        newEvent = res.data;
      })
      .then(res => {
        const newCollection =  this.state.collection;
        // TODO: push item in correct spot
        newCollection.push(newEvent);
        this.setState({
          collection: newCollection
        })
        console.log("Event Added!")
      })
      .catch((error) => {
        console.log(error);
      });

  }

  updateEvent(newEvent){
    const eventID = this.state.event._id;
    const url = "/events/update/" + eventID;
    axios.post(url, newEvent)
      .then(res => console.log(res.data));
    const index = this.state.collection.findIndex(evnt => evnt._id === eventID);
    const newCollection = this.state.collection
    newEvent["_id"] = eventID;
    newCollection[index] = newEvent;
    // TODO: try putting this in a setState, this works now but it's better to
    // have a setstate? i read somewhere...
  }

  deleteEvent(event){
    const id = event._id
    axios.delete("/events/" + id)
      .then(res => console.log(res.data))
      .then(() =>
      this.setState({
        collection:this.state.collection.filter(evnt => evnt._id !== id)
      })
    );
  }

  createUser(){
    alert('Sign Up Successful!');
    this.setState({
      menu: false,
      signUp: false
    })
  }

  login(token){
    alert('Login Successful!');
    setInStorage('events-app', {token: token})
    window.location.reload();
  }

  logout(){
    const obj = getFromStorage('events-app');
    if (obj && obj.token) {
      const { token } = obj;
      axios.delete("/users/account/logout/" + token)
        .then(res => {
          if (res.data) {
            console.log(res.data)
            this.setState({
              token: '',
              admin: false
            });
          }
        });
    }
    this.setState({ editor: false, signUp:false, menu: !this.state.menu});
  }

  render() {
    var menuButton = (this.state.editor) || this.state.changeAdmin ? null: (<button className="button" onClick={() => { this.setState({ menu: !this.state.menu }); }}>Menu</button>);
    var sign = this.state.signUp ? ("Events"): ("Sign In");
    var log = (this.state.token.length > 1) ? (<button className="button" onClick={() => { this.logout() }}>LogOut</button>):
    (
      <button className="button" onClick={() => { this.setState({ signUp: !this.state.signUp, menu: false}); }}>{sign}</button>
    );
    const newEventButton = !this.state.signUp && this.state.admin ? (<button className="button" onClick={() => { this.setState({ editor: !this.state.editor, menu: !this.state.menu}); }}>New Event</button>): null;
    const adminChange = this.state.admin ? (<button className="button" onClick={() => { this.setState({ changeAdmin: !this.state.changeAdmin, menu:!this.state.menu}); }}>Change Admin</button>): null;
    var menu = this.state.menu ? (
      <div className='menuBar'>
        {newEventButton}
        {adminChange}
        {log}
      </div>

    ): null;
  //   menu = this.state.signUp ? (<button className="button" onClick={() => { this.setState({ signUp: !this.state.signUp, menu: false}); }}>Events</button>
  // ): menu;
    var page = this.state.editor ? (<EventEditor handleSave={this.handleSave} event={this.state.event}/>): (<EventsContainer data={this.state.collection} chooseEvent={(editEvent)=> this.setState({event: editEvent, editor: !this.state.editor})} deleteEvent={this.deleteEvent} token={this.state.admin}/>);
    page = this.state.signUp? (<div className="d-flex justify-content-center"><SignUp createUser={this.createUser}/><Login login={this.login}/></div>): page
    page = this.state.changeAdmin && this.state.admin? (<AdminList handleSave={this.handleSave}/>): page;
    return (
      <div id="app">

        <div className="topnav">
          <div className="topnav-centered">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Events</h1>
          </div>

          <div className="topnav-right">
            {menuButton}
          </div>
        </div>

          <div className="container, menuRow">
            <div className="row justify-content-md-center">
            <div className="col">
              {page}
            </div>
            <div className='col-md-auto, topnav-right'>
              {menu}
            </div>
            </div>

          </div>
      </div>

    );
  }
}

export default App;
