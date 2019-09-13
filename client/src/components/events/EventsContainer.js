import React, { Component } from 'react';
import EventContainer from './EventContainer';

class EventsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { newState: null };
  }

  render() {
    const listEvents = this.props.data.map((event) => (
      <EventContainer
        key={event.name}
        event={event}
        chooseEvent={this.props.chooseEvent}
        deleteEvent={this.props.deleteEvent}
        token={this.props.token}
      />
    ));

    return (
      <div className="eventsContainer">
        {listEvents}
      </div>
    );
  }
}

export default EventsContainer;
