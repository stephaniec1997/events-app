import React from 'react';

function EventContainer(props) {
  const {
    name, startDate, endDate, place, description,
  } = props.event;
  const button = props.token;
  const start = startDate ? (new Date(startDate)).toDateString() : null;
  const end = endDate ? (new Date(endDate)).toDateString() : null;
  const date = (start === end) ? start : (`${start} - ${end}`);

  const buttons = button ? (
    <div>
      <button onClick={() => { props.chooseEvent(props.event); }}>Edit</button>
      <button onClick={() => { props.deleteEvent(props.event); }}>Delete</button>
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

export default EventContainer;
