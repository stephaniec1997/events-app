import React from 'react';
import PropTypes from 'prop-types';
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

EventsContainer.propTypes = {
  token: PropTypes.bool.isRequired,
  chooseEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    place: PropTypes.string,
    description: PropTypes.string,
  }).isRequired).isRequired,
};

export default EventsContainer;
