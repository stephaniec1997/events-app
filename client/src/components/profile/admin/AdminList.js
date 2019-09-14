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
    const { handleSave } = this.props;
    const { changed } = this.state;
    for (let i = 0; i < (changed.length); i += 1) {
      // axios
      console.log(changed[i]);

      const user = changed[i];
      const link = `/users/admin/${user._id}`;
      axios.post(link)
        .then((res) => console.log(res.data));
    }
    alert('Changes have been made. \n Changes you have made on your own account will not change until you logout. ');
    handleSave();
  }

  isChanged(user) {
    const { changed } = this.state;
    const { change } = changed;
    if (change.includes(user)) {
      const i = change.find((u) => u._id === user._id);
      change.splice(i, 1);
    } else {
      change.push(user);
    }
    this.setState({ changed: change });
  }

  render() {
    const { collection, changed } = this.state;
    const { handleSave } = this.props;
    const listUsers = collection.map((user) => (
      <UserContainer
        user={user}
        key={user.username}
        isChanged={this.isChanged}
      />
    ));

    return (
      <div className="eventsContainer">
        {listUsers}
        <button type="button" onClick={() => { handleSave(); }}>Cancel</button>
        <button type="button" onClick={() => { this.changeAdmin(changed); }}>
Make Changes in Admin
        </button>
      </div>
    );
  }
}

export default AdminList;
