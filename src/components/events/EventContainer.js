import React from 'react';

function EventContainer(props){
  const {name, startDate, endDate, place, description} = props.event
  const start = startDate? startDate.toString(): null;
  const end = endDate? endDate.toString(): null;

  return(
    <div>
    <br/>
      <b>{name}</b><br/>
      {start} &#160;
      {end}<br/>
      {place}<br/>
      {description}<br/>
      <button onClick={() => {props.chooseEvent(props.event)}}>Edit</button>
      <button onClick={() => {props.deleteEvent(props.event)}}>Delete</button>
    </div>
  );
}

export default EventContainer;
