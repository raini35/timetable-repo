/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import Event from './Event';

import './EventRow.css';

class EventRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { eventsNow, editEvent, deleteEvent } = this.props;
    return (
      <div className="event-row">
        {eventsNow.map(event => (
          <Event
            event={event}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        ))}
      </div>
    );
  }
}

export default EventRow;
