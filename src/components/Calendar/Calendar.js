/* eslint-disable react/sort-comp, class-methods-use-this, react/jsx-filename-extension */
import dateFns from 'date-fns';

import React, { Component } from 'react';
import CalendarWeek from './CalendarWeek';
import CalendarHeader from './CalendarHeader';

import './Calendar.css';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { rowOfDays, currentEvents, currentMonth, startAndEndOfWeeks } = this.props;
    const { selectWeek, prevMonthClick, nextMonthClick, deleteEvent, editEvent } = this.props;

    const prevMonth = dateFns.subMonths(currentMonth, 1);
    const nextMonth = dateFns.addMonths(currentMonth, 1);
    const prevMonthButton = `${prevMonth.toLocaleString('en-us', { month: 'long' })} ${prevMonth.getFullYear()}`;
    const nextMonthButton = `${nextMonth.toLocaleString('en-us', { month: 'long' })} ${nextMonth.getFullYear()}`;

    const weekDayRow = [
      <div className="calendar-week calendar-week-days">
        <div className="weekday-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
      </div>,
    ];

    return (
      <div className="calendar-container">
        <CalendarHeader
          prevMonthClick={prevMonthClick}
          nextMonthClick={nextMonthClick}
          prevMonthButton={prevMonthButton}
          nextMonthButton={nextMonthButton}
          currentMonth={currentMonth}
        />
        <div className="calendar-days-and-events">
          {weekDayRow}
          {rowOfDays.map((days, i) => (
            <CalendarWeek
              index={i}
              startAndEndWeekNumbers={startAndEndOfWeeks[i]}
              currentMonth={currentMonth}
              otherEvents={currentEvents[i]}
              daysOfCurrentWeek={days}
              selectWeek={selectWeek}
              deleteEvent={deleteEvent}
              editEvent={editEvent}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Calendar;
