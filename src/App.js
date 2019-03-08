/* eslint-disable react/sort-comp, class-methods-use-this, */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable lines-between-class-members, no-alert, object-curly-newline */
import dateFns from 'date-fns';
import React, { Component } from 'react';
import Calendar from './components/Calendar/Calendar';
import FeatureBar from './components/FeatureBar/FeatureBar';

import { processEvents, updateContainer } from './_helpers/event_timeline';
import timelineItems from './data/timelineItems';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date('1/14/2018'),
      selectedDate: new Date('1/14/2018'),
      selectedWeek: 0,
      organizedEvents: {},
    };

    this.selectEvent = this.selectEvent;
    this.selectWeek = this.selectWeek;
    this.addEvent = this.addEvent.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.getDayAndWeeks = this.getDayAndWeeks.bind(this);
    this.getDayAndWeeks = this.getDayAndWeeks.bind(this);
    this.getWeek = this.getWeek.bind(this);
  }

  componentDidMount() {
    const { selectedDate } = this.state;
    const container = {};
    const selectedWeek = this.getWeek(selectedDate);

    processEvents(timelineItems, container);

    this.setState({
      organizedEvents: container,
      selectedWeek,
    });
  }

  // Gets the week number (1-53) of a given date 
  getWeek(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - firstDayOfYear) / 86400000) + firstDayOfYear.getDay() + 1) / 7);
  }

  // Moves the calendar to the next month
  nextMonth() {
    this.setState(prevState => ({
      currentMonth: dateFns.addMonths(prevState.currentMonth, 1),
    }));
  }

  // Moves the calendar to the month before
  prevMonth() {
    this.setState(prevState => ({
      currentMonth: dateFns.subMonths(prevState.currentMonth, 1),
    }));
  }

  // Outputs an object containging two things: 
  // rowOfDays --> an array of arrays, each array containing the numbers 
  //    of each week in the given month 
  // startAndEndOfWeeks --> an array of arrays, each array containing 
  //    two elements, (1) an array containing the year and the week 
  //    number of the first day and (2) an array containing the year 
  //    and the week number of the last day
  getDayAndWeeks(currentMonth) {
    const startAndEndOfWeeks = [];
    const rowOfDays = [];
    let temp = [];
    let days = [];

    // First day of the given month 
    const monthStart = dateFns.startOfMonth(currentMonth);
    // Last day of the given month
    const monthEnd = dateFns.endOfMonth(monthStart);

    // First day of the week for when the month starts. Some months 
    // start on days that are not in the actual month
    const startDate = dateFns.startOfWeek(monthStart);
    // Last day of the week for when the month ends. Some months 
    // end on days that are not in the actual month 
    const endDate = dateFns.endOfWeek(monthEnd);

    let day = startDate;

    // Loops through all the days from startDate to endDate
    while (day <= endDate) {
      // For loop iterates by 7 so that it stores information by week. This 
      // allows the rest of the program to keep to a week by week structure.
      for (let i = 0; i < 7; i += 1) {
        days.push(day);

        // Stores the information of the first and last day
        if (i === 0 || i === 6) {
          temp.push([day.getFullYear(), this.getWeek(day)]);
        }

        day = dateFns.addDays(day, 1);
      }

      rowOfDays.push(days);
      startAndEndOfWeeks.push(temp);

      temp = [];
      days = [];
    }

    return { rowOfDays, startAndEndOfWeeks };
  }

  // Gets the events based on the array of arrays containing the 
  // given year and the given week for an event 
  getEventsByWeekNumber(container, startAndEndOfWeeks) {
    const currentEvents = [];
  
    for (let i = 0; i < startAndEndOfWeeks.length; i += 1) {
      const start = startAndEndOfWeeks[i][0];
      const startYear = start[0];
      const startWeek = start[1];

      const end = startAndEndOfWeeks[i][1];
      const endYear = end[0];
      const endWeek = end[1];

      let temp = {};

      // Only adds to temp object if week of events exists
      if (container[startYear]) {
        if (container[startYear][startWeek]) {
          temp = {...temp, ...container[startYear][startWeek]};
        }
      }

      // This handles the edge case for when the year starts or ends on
      // a different year. 
      // Ex. MON - 12/30/2018, TUES - 12/31/2018, WED - 1/1/2018, ...
      // Ex. ...MON - 12/31/2018, TUES - 1/1/2019, WED - 1/2/2019
      if (startYear !== endYear || startWeek !== endWeek) {
        if (container[endYear]) {
          if (container[endYear][endWeek]) {
            temp = {...temp, ...container[endYear][endWeek]};
          }
        }
      }
      currentEvents.push(temp);
    }

    return currentEvents;
  }

  addEvent(e, event_data) {
    e.stopPropagation();
    // let newContainer = updateContainer('add_event', tempObject, organizedEvents);
    // console.log(newContainer);
    alert('Suppose to open up a modal to ADD event');
  }
  
  editEvent(e, newEvent, originalEvent) {
    e.stopPropagation();
    // let newContainer = updateContainer('add_event', tempObject, organizedEvents);
    // console.log(newContainer);
    alert(`Suppose to EDIT following event: ${originalEvent.id}. ${originalEvent.name}`);
  }

  selectEvent(e, event) {
    e.stopPropagation();
    alert(`Suppose to SELECT following event: ${event.id}. ${event.name}`);
  }

  selectWeek(week, currentMonth) {
    const month = currentMonth.toLocaleString('en-us', { month: 'long' });
    const year = currentMonth.getFullYear();
    alert(`Suppose to SELECT following event: ${week} of ${month} ${year}`);
  }

  deleteEvent(e, event) {
    e.stopPropagation();
    alert(`Suppose to DELETE following event: ${event.id}. ${event.name}`);
  }

  render() {
    const { currentMonth, organizedEvents } = this.state;

    const { rowOfDays, startAndEndOfWeeks } = this.getDayAndWeeks(currentMonth);

    const currentEvents = this.getEventsByWeekNumber(organizedEvents, startAndEndOfWeeks);

    const eventsForFeatureBar = [];

    const alreadyPlaced = {};

    // The following flattens the array of objects so it can be used for FeatureBar
    currentEvents.forEach((events) => {
      for(let key in events) {
        let event = events[key];
        if (alreadyPlaced[event.id] === undefined) {
          eventsForFeatureBar.push(event);
          alreadyPlaced[event.id] = true;
        }
      }
    });

    return (
      <div className="timetable-app">
        <FeatureBar
          currentMonth={currentMonth}
          rowOfDays={rowOfDays}
          eventsForFeatureBar={eventsForFeatureBar}
          prevMonth={this.prevMonth}
          nextMonth={this.nextMonth}
          selectEvent={this.selectEvent}
          addEvent={this.addEvent}
          editEvent={this.editEvent}
          deleteEvent={this.deleteEvent}
        />

        <Calendar
          prevMonthClick={this.prevMonth}
          nextMonthClick={this.nextMonth}
          currentMonth={currentMonth}
          startAndEndOfWeeks={startAndEndOfWeeks}
          currentEvents={currentEvents}
          selectWeek={this.selectWeek}
          rowOfDays={rowOfDays}
          editEvent={this.editEvent}
          deleteEvent={this.deleteEvent}
        />
      </div>
    );
  }
}

export default App;
