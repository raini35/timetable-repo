/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import MiniCalendar from './MiniCalendar';
import ListOfTags from './ListOfTags';
import logo from '../../images/logo.png';

import './FeatureBar.css';

const FeatureBar = (props) => {
  const { currentMonth, rowOfDays, eventsForFeatureBar} = props;
  const { selectEvent, addEvent, editEvent, deleteEvent } = props;
  const { prevMonth, nextMonth } = props;

  return (
    <div className="feature-bar">
      <div className="logo-container">
        <div className="logo">
          <img className="logo-image" src={logo} alt="time-table-logo" />
          <h1 className="logo-text">timetable</h1>
        </div>
      </div>
      <div className="button-container">
        <button type="button" onClick={addEvent} className="add-event-button">Add Event</button>
      </div>

      <MiniCalendar
        currentMonth={currentMonth}
        rowOfDays={rowOfDays}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />

      <ListOfTags
        eventsForFeatureBar={eventsForFeatureBar}
        selectEvent={selectEvent}
        editEvent={editEvent}
        deleteEvent={deleteEvent}
      />
    </div>
  );
};

export default FeatureBar;
