import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"

class EventEditor extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.event ? this.props.event.name : '',
      startDate: this.props.event ? this.props.event.startDate : new Date(),
      endDate: this.props.event ? this.props.event.endDate : new Date(),
      place: this.props.event ? this.props.event.place : '',
      description: this.props.event ? this.props.event.description : ''
    };

    this.updateDate = this.updateDate.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }



  updateInfo(key, e){
    const value = {};
    value[key] =  e.target.value;
    this.setState(value);
  }

  updateDate(key, date){
    const value = {};
    value[key] = date;
    this.setState(value);
  }

  render() {
    const options = Object.keys(this.state).map((key) => {
      if (key === 'startDate' || key === 'endDate'){
        return(
          //the date picker
          <div key={key}>
            {key}:
            <DatePicker
            key={key}
            selected={new Date(this.state[key])}
            onChange={(dateTime) => this.updateDate(key, dateTime)}
            />
          </div>
        );
      }
      return (
        <div key={key}>
          {key}:
          <input key={key} value={this.state[key]} onChange={(e) => {this.updateInfo(key, e);}} />
        </div>
      );
    });

    return (
      <div className="eventsContainer">
        {options}
        <button onClick={() => {this.props.handleSave()}}>Cancel</button>
        <button onClick={() => {this.props.handleSave(this.state)}}>Save</button>
      </div>
    );
  }
}

export default EventEditor;
