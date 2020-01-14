import React from 'react';
import PropTypes from 'prop-types';

function EventContainer(props) {
  const { event, token } = props;
  const {
    name, startDate, endDate, place, description,
  } = event;
  const button = token;
  const start = startDate ? (new Date(startDate)).toDateString() : null;
  const end = endDate ? (new Date(endDate)).toDateString() : null;
  const date = (start === end) ? start : (`${start} - ${end}`);

  const buttons = button ? (
    <div>
      <button type="button" onClick={() => { props.chooseEvent(props.event); }}>Edit</button>
      <button type="button" onClick={() => { props.deleteEvent(props.event); }}>Delete</button>
    </div>
  ) : null;
  return (
    <div>
      <br />
      <b>{name}</b>
      <br />
      {date}
      <br />
      {place}
      <br />
      {description}
      <br />
      {buttons}
    </div>
  );
}

EventContainer.propTypes = {
  token: PropTypes.bool.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  chooseEvent: PropTypes.func.isRequired,
  event: PropTypes.shape({
    name: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    place: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default EventContainer;
