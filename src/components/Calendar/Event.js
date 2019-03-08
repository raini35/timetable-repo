/* eslint-disable react/jsx-filename-extension, no-alert */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';

import './Event.css';

class Event extends Component {
  constructor(props) {
    super(props); 
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, event) {
    e.stopPropagation();
    alert(`This first opens up a modal to view event ${event.id}. ${event.name}. But if you double click or press the edit button it will open up...`)
    const { editEvent } = this.props;
    // In the actual implementation the second argument would be the edited/new event
    editEvent(e, event, event);
  }

  render() {
    const { event } = this.props;
    const start = event.start.split('-');
    const end = event.end.split('-');
    const startDate = `${start[1]}-${start[2]}-${start[0]}`;
    const endDate = `${end[1]}-${end[2]}-${end[0]}`;

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => { this.handleClick(e, event); }}
        id={event.id}
        title={`${event.name} (${startDate} to ${endDate})`}
        className={event.classString}
        style={{ gridArea: `1 / ${event.startCol} / 2 /${event.endCol}` }}
      >
        {event.name}
        <i>({startDate} to {endDate})</i>
      </div>
    );
  }
}

export default Event;
