import React, { Component } from 'react';

class UserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { check: this.props.user ? this.props.user.admin : null };
  }

  render() {
    const { username, email } = this.props.user;
    const check = (
      <input
        name="admin"
        type="checkbox"
        checked={this.state.check}
        onChange={() => { this.setState({ check: !this.state.check }); this.props.isChanged(this.props.user); }}
      />
    );
    return (
      <div>
        <br />
        <b>{username}</b>
        {' '}
&#160;
        {email}
        {' '}
&#160;
        {check}
      </div>
    );
  }
}

export default UserContainer;
