import React, { Component } from 'react';
import axios from 'axios';
import {
  Navbar, Nav,
  // NavDropdown,
} from 'react-bootstrap/';
import '../App.css';
import { setInStorage, getFromStorage } from '../utils/storage';

import EventsContainer from './events/EventsContainer';
import EventEditor from './events/EventEditor';
import SignUp from './profile/SignUp';
import Login from './profile/Login';

import AdminList from './profile/admin/AdminList';

const logo =  require('../logo1.png');


function login(token) {
  alert('Login Successful!');
  setInStorage('events-app', { token });
  window.location.reload();
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      menu: false,
      editor: false,
      signUp: false,
      changeAdmin: false,
      event: null,
      collection: [],
      token: '',
      admin: false,
    };

    this.handleSave = this.handleSave.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.createUser = this.createUser.bind(this);
    this.logout = this.logout.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    // LOAD EVENTS
    axios.get('/events/')
      .then((response) => {
        this.setState({
          collection: response.data,
        });
        let sortedData = response.data;
        sortedData = sortedData.sort((a, b) => {
          if (a.startDate > b.startDate) {
            return 1;
          } if ((a.startDate) < (b.startDate)) {
            return -1;
          }
          return 0;
        });
        this.setState({ collection: sortedData });

        // TODO: Do not display those events that have passed
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });


    // GET/VERIFY TOKEN
    const obj = getFromStorage('events-app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      axios.get(`/users/account/verify/${token}`)
        .then((res) => {
          if (res.data.success) {
            this.setState({
              token,
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

  // if new event hit new event enpoint,
  // else hit update event enpoint
  handleSave(newEvent) {
    const { event } = this.state;
    if (newEvent) {
      if (event) {
        this.updateEvent(newEvent);
      } else {
        this.addEvent(newEvent);
      }
    }
    this.setState({
      editor: false, menu: false, event: null, changeAdmin: false,
    });
  }

  // hits new event endpoint
  addEvent(newEvent) {
    const { collection } = this.state;
    axios.post('/events/add', newEvent)
      .then((res) => (res.data))
      .then((res) => {
        const newCollection = collection;
        // TODO: push item in correct spot not just the end
        newCollection.push(res);
        // update state to inlcude new event
        this.setState({
          collection: newCollection,
        });
        console.log('Event Added!'); // eslint-disable-line no-console
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
  }

  // hits update event enpoint
  updateEvent(newEvent) {
    const { event, collection } = this.state;
    const eventID = event._id;
    const url = `/events/update/${eventID}`;
    axios.put(url, newEvent)
      .then((res) => console.log(res.data)); // eslint-disable-line no-console
    const index = collection.findIndex((evnt) => evnt._id === eventID);
    const newCollection = collection;
    const newEventWithID = newEvent;
    newEventWithID._id = eventID;
    newCollection[index] = newEventWithID;
    // TODO: try putting this in a setState, this works now but it's better to
    // have a setstate? i read somewhere...
  }

  // hits delete event endpoint
  deleteEvent(event) {
    const { collection } = this.state;
    const id = event._id;
    axios.delete(`/events/${id}`)
      .then((res) => {
        console.log(res.data); // eslint-disable-line no-console
        const newCollection = collection.filter((evnt) => evnt._id !== id);
        // update state so deleted event isn't displayed
        this.setState({
          collection: newCollection,
        });
      });
  }

  createUser() {
    alert('Sign Up Successful!');
    this.setState({
      menu: false,
      signUp: false,
    });
  }

  // hits logout endpoint
  logout() {
    const { menu } = this.state;
    const obj = getFromStorage('events-app');
    if (obj && obj.token) {
      const { token } = obj;
      axios.delete(`/users/account/logout/${token}`)
        .then((res) => {
          if (res.data) {
            this.setState({
              token: '',
              admin: false,
            });
          }
        });
    }
    this.setState({ editor: false, signUp: false, menu: !menu });
  }

  render() {
    const {
      editor, signUp, token, admin, menu, changeAdmin, event, collection,
    } = this.state;
    // <button
    //     aria-controls="responsive-navbar-nav"
    //     type="button"
    //     aria-label="Toggle navigation"
    //     class="navbar-toggler collapsed"
    //   >
    //     <span class="navbar-toggler-icon"></span>
    // </button>
    // const menuButton = editor || changeAdmin ? null: (
    // <button
    //   aria-controls="basic-navbar-nav"
    //   type="button"
    //   aria-label="Toggle navigation"
    //   class=""
    // >
    //   <span class="navbar-toggler-icon"></span>
    // </button>
    // );
    const menuButton = (editor) || changeAdmin ? null : (<Nav.Link bsPrefix="colorChange" type="button" onClick={() => { this.setState({ menu: !menu }); }}><span className="navbar-toggler-icon" /></Nav.Link>);
    const sign = signUp ? ('Events') : ('Sign In');
    const log = (token.length > 1) ? (<Nav.Link bsPrefix="colorChange" onClick={() => { this.logout(); }}>LogOut</Nav.Link>)
      : (
        <Nav.Link bsPrefix="colorChange" onClick={() => { this.setState({ signUp: !signUp, menu: false }); }}>{sign}</Nav.Link>
      );
    const newEventButton = !signUp && admin ? (<Nav.Link bsPrefix="colorChange" onClick={() => { this.setState({ editor: !editor, menu: !menu }); }}>New Event</Nav.Link>) : null;
    const adminChange = admin ? (<Nav.Link bsPrefix="colorChange" onClick={() => { this.setState({ changeAdmin: !changeAdmin, menu: !menu }); }}>Change Admin</Nav.Link>) : null;
    const menuDisplay = menu ? (
      <div>
        {newEventButton}
        <br />
        {adminChange}
        <br />
        {log}
      </div>

    ) : null;
    let page = editor ? (
      <EventEditor
        handleSave={this.handleSave}
        event={event}
      />
    ) : (
      <EventsContainer
        data={collection}
        chooseEvent={(editEvent) => this.setState({ event: editEvent, editor: !editor })}
        deleteEvent={this.deleteEvent}
        token={admin}
      />
    );
    page = signUp ? (
      <div className="d-flex justify-content-center">
        <SignUp createUser={this.createUser} />
        <Login login={login} />
      </div>
    ) : page;
    page = changeAdmin && admin ? (<AdminList handleSave={this.handleSave} />) : page;
    // TODO: make menu items be under navbar
    return (
      <div>
        <Navbar bg="dark" className="heightChange">
          <Navbar.Brand
            className="center"
            onClick={() => {
              this.setState({
                menu: false, editor: false, signUp: false, changeAdmin: false,
              });
            }}
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
          <div className="flex-item">
            <Nav className="justify-content-end">
              {menuButton}
            </Nav>
            <Nav>
              {menuDisplay}
            </Nav>
          </div>
        </Navbar>

        <div className="container, menuRow">
          <div className="row justify-content-md-center">
            <div className="col">
              {page}
            </div>
          </div>

        </div>
      </div>

    );
    // return (
    //   <Navbar bg="dark" expand="lg" variant="dark">
    //     <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="mr-auto">
    //         <Nav.Link href="#home">Home</Nav.Link>
    //         <Nav.Link href="#link">Link</Nav.Link>
    //         <NavDropdown title="Dropdown" id="basic-nav-dropdown">
    //           <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
    //           <NavDropdown.Divider />
    //           <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
    //         </NavDropdown>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Navbar>
    //
    // );
  }
}

export default Main;
