import React, { Component } from 'react';
import axios from 'axios';

import UserContainer from './UserContainer';


class AdminList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [],
      changed: [],
    };
    this.changeAdmin = this.changeAdmin.bind(this);

    this.isChanged = this.isChanged.bind(this);
  }


  componentDidMount() {
    // LOAD EVENTS
    axios.get('/users/')
      .then((response) => {
        this.setState({
          collection: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  changeAdmin() {
    for (let i = 0; i < (this.state.changed.length); i += 1) {
      // axios
      console.log(this.state.changed[i]);

      const user = this.state.changed[i];
      const link = `/users/admin/${user._id}`;
      axios.post(link)
        .then((res) => console.log(res.data));
    }
    alert('Changes have been made. \n Changes you have made on your own account will not change until you logout. ');
    this.props.handleSave();
  }

  isChanged(user) {
    const change = this.state.changed;
    if (change.includes(user)) {
      const i = change.find((u) => u._id === user._id);
      change.splice(i, 1);
    } else {
      change.push(user);
    }
    this.setState({ changed: change });
  }

  render() {
    const listUsers = this.state.collection.map((user) => (
      <UserContainer
        user={user}
        key={user.username}
        isChanged={this.isChanged}
      />
    ));

    return (
      <div className="eventsContainer">
        {listUsers}
        <button onClick={() => { this.props.handleSave(); }}>Cancel</button>
        <button onClick={() => { this.changeAdmin(this.state.changed); }}>Make Changes in Admin</button>
      </div>
    );
  }
}

export default AdminList;
