import React from 'react';
import EventContainer from './EventContainer';

function EventsContainer(props) {
  const {
    data, token, chooseEvent, deleteEvent,
  } = props;
  const listEvents = data.map((event) => (
    <EventContainer
      key={event.name}
      event={event}
      chooseEvent={chooseEvent}
      deleteEvent={deleteEvent}
      token={token}
    />
  ));

  return (
    <div className="eventsContainer">
      {listEvents}
    </div>
  );
}

export default EventsContainer;
