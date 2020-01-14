import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';


class EventEditor extends Component {
  constructor(props) {
    super(props);
    const { event } = this.props;
    this.state = {
      name: event ? event.name : '',
      startDate: event ? event.startDate : new Date(),
      endDate: event ? event.endDate : new Date(),
      place: event ? event.place : '',
      description: event ? event.description : '',
      pad: false,
    };

    this.updateDate = this.updateDate.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }


  updateInfo(key, e) {
    const value = {};
    value[key] = e.target.value;
    this.setState(value);
  }

  updateDate(key, date) {
    const value = {};
    value[key] = date;
    this.setState(value);
  }

  render() {
    const { state } = this;
    const { handleSave } = this.props;
    const options = Object.keys(state).map((key) => {
      if (state[key] === false) {
        return null;
      }
      if (key === 'startDate' || key === 'endDate') {
        return (
          // the date picker
          <div key={key}>
            {key}
:
            <DatePicker
              forceShowMonthNavigation
              popperPlacement="top"
              popperModifiers={{
                flip: {
                  enabled: false,
                },
                preventOverflow: {
                  enabled: true,
                  escapeWithReference: false,
                },
              }}
              onClickOutside={() => this.setState({ pad: false })}
              onSelect={() => this.setState({ pad: false })}
              onFocus={() => this.setState({ pad: true })}
              className={state.pad && (key === 'startDate') ? 'eventsStart' : null}
              showMonthDropdown
              key={key}
              selected={new Date(state[key])}
              onChange={(dateTime) => this.updateDate(key, dateTime)}
            />
          </div>
        );
      }

      return (
        <div key={key}>
          {key}
          <input
            key={key}
            value={state[key]}
            onChange={(e) => { this.updateInfo(key, e); }}
          />
        </div>
      );
    });

    return (
      <div className="eventsContainer">
        {options}
        <button type="button" onClick={() => { handleSave(); }}>Cancel</button>
        <button type="button" onClick={() => { handleSave(state); }}>Save</button>
      </div>
    );
  }
}

EventEditor.propTypes = {
  handleSave: PropTypes.func.isRequired,
  event: PropTypes.shape({
    name: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    place: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default EventEditor;
