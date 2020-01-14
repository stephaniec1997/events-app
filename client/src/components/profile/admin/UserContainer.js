import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserContainer extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = { check: user.admin };
  }

  render() {
    const { user, isChanged } = this.props;
    const { username, email } = user;
    const { check } = this.state;
    const checkbox = (
      <input
        name="admin"
        type="checkbox"
        checked={check}
        onChange={() => {
          this.setState({ check: !check });
          isChanged(user);
        }}
      />
    );
    return (
      <div>
        <br />
        <b>{username}</b>
        {' '}
        {email}
        {' '}
        {checkbox}
      </div>
    );
  }
}
UserContainer.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    admin: PropTypes.bool.isRequired,
  }).isRequired,
  isChanged: PropTypes.func.isRequired,
};

export default UserContainer;
