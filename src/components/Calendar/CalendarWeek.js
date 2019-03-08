/* eslint-disable react/sort-comp, react/jsx-filename-extension, class-methods-use-this */
import dateFns from 'date-fns';

import React, { Component } from 'react';
import EventRow from './EventRow';

import { sortEvents } from '../../_helpers/event_timeline.js';

import './CalendarWeek.css';

class CalendarWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getStartEndColsAndClasses = this.getStartEndColsAndClasses.bind(this);
    this.figureOutRowPlaceOfEvent = this.figureOutRowPlaceOfEvent.bind(this);
    this.processEvents = this.processEvents.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
    this.renderWeekNumbers = this.renderWeekNumbers.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Figures out three things: when the event starts on the grid, when the event 
  // ends on the grid, and the classes associated w/ the event
  getStartEndColsAndClasses(start, end) {
    const { daysOfCurrentWeek } = this.props;
    const startDateOfWeek = daysOfCurrentWeek[0];
    const endDateOfWeek = daysOfCurrentWeek[6];

    let classString = 'event';

    const startDateOfEvent = new Date(start[1] + '/' + start[2] + '/' + start[0]);
    // Adds by one b/c css grid coordinate starts at 1 not 0 
    let startCol = startDateOfEvent.getDay() + 1;
    // Adds because we want to take up the space for the last day not
    // just end when the space starts
    const endDateOfEvent=new Date(end[1] + "/" + end[2] + "/" + end[0]);
    let endCol = endDateOfEvent.getDay() + 2;

    // If the event starts before the week begins, get rid of the rounded
    // corners on the left hand side
    if (startDateOfWeek > startDateOfEvent) {
      classString += ' border-left-radius-none';
      startCol = 1;
    }

    // If the event ends after the week ends, get rid of the rounded 
    // corners on the right side 
    if (endDateOfWeek < endDateOfEvent) {
      classString += ' border-right-radius-none';
      endCol = 8;
    }

    return { startCol, endCol, classString };
  }

  // Places the event on the row that has space 
  figureOutRowPlaceOfEvent(event, rowTracker, lastRow, output) {
    let currentRow = 0;
    let eventPlaced = false;
    const { startCol, endCol } = event;

    while (!eventPlaced) {
      if (rowTracker[currentRow] <= startCol) {
        // Update the row tracker for the event that was added
        rowTracker[currentRow] = endCol;
        output[currentRow].push(event);
        eventPlaced = true;
      } else {
        // The below if statement is true when all the rows are full 
        // or unavailable so a new row must be added
        if (currentRow === lastRow) {
          lastRow += 1;
          output.push([]);
          // Adds the row that was just added to the tracker
          rowTracker[lastRow] = 0;
        }
        currentRow += 1;
      }
    }
    return;
  }

  // Outputs an array of arrays, each array containing events with their proper
  // grid area placements (startCol, endCol)
  processEvents(inputEvents) {
    // This will contain the events in their proper rows
    let events = [];

    // Turns the object storing the events with their ids into arrays 
    // Then sorts them first by their start date and then their duration
    for(let key in inputEvents) {
      events.push(inputEvents[key]);
    }
    sortEvents(events);

    const output = new Array(4);

    for (let i = 0; i < output.length; i += 1) {
      output[i] = [];
    }

    // This keeps track of the ending coordinate of the last event that was
    // placed on the row 
    const rowTracker = {
      0: 0, 1: 0, 2: 0, 3: 0,
    };

    const lastRow = 3;

    for (let i = 0; i < events.length; i += 1) {
      let event = events[i];

      const start = event.start.split('-');
      const end = event.end.split('-');

      const { startCol, endCol, classString } = this.getStartEndColsAndClasses(start, end);

      event = {
        ...event,
        startCol,
        endCol,
        classString,
      };

      this.figureOutRowPlaceOfEvent(event, rowTracker, lastRow, output);
    }
    return output;
  }

  // Passes the events into <EventRow /> component
  renderEvents() {
    const { otherEvents, editEvent, deleteEvent } = this.props;
    const processedEvents = this.processEvents(otherEvents);

    const outputEvents = [];

    // Using the processed events to create the event rows
    for (let i = 0; i < processedEvents.length; i += 1) {
      const eventsNow = processedEvents[i];
      // If there are no events then output empty divs
      if (eventsNow.length === 0) {
        outputEvents.push(<div className="event-row" />);
      } else {
        outputEvents.push(
          <EventRow 
            editEvent={editEvent} 
            deleteEvent={deleteEvent} 
            eventsNow={eventsNow} 
          />,
        );
      }
    }
    return outputEvents;
  }

  // Processes the numbers of each week for the month 
  renderWeekNumbers() {
    const { daysOfCurrentWeek, currentMonth } = this.props;
    const dateFormat = 'D';
    const monthStart = dateFns.startOfMonth(currentMonth);

    const dayRow = [];

    for (let i = 0; i < daysOfCurrentWeek.length; i += 1) {
      const day = daysOfCurrentWeek[i];
      // Checks if number is in the current month. If not adds the class 'not-in-month' 
      // to the day 
      const classes = !dateFns.isSameMonth(day, monthStart) ? 'date-number not-in-month' : 'date-number';
      // Converts Date object to just its day
      const formattedDate = dateFns.format(day, dateFormat);
      dayRow.push(<div className={classes}>{formattedDate}</div>);
    }

    return <div className="event-row date-numbers" key={daysOfCurrentWeek[0]}>{dayRow}</div>;
  }

  // Filler for when a user clicks on the week
  handleClick(e, weekNumber, currentMonth) {
    e.stopPropagation();

    const { selectWeek } = this.props;

    selectWeek(weekNumber, currentMonth);
  }

  render() {
    const { currentMonth, startAndEndWeekNumbers } = this.props;
    const startWeekNumber = startAndEndWeekNumbers[0];
    const endWeekNumber = startAndEndWeekNumbers[1];
    let weekNumber = startWeekNumber[1];

    // This handles the case when the start day and end day has different years and the 
    // end day might have the right week number b/c the start day might have been from 
    // the previous year 
    if (startWeekNumber[0] !== endWeekNumber[0]) {
      const thisYear = currentMonth.getFullYear();
      if (endWeekNumber[0] === thisYear) {
        weekNumber = endWeekNumber[1];
      }
    }

    return (
      <div onClick={(e) => {this.handleClick(e, weekNumber, currentMonth); }} className="calendar-week" >
        {this.renderEvents()}
        {this.renderWeekNumbers()}
      </div>
    );
  }
}

export default CalendarWeek;
