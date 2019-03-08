/* eslint-disable react/jsx-filename-extension */
import dateFns from 'date-fns';
import React, { Component } from 'react';

import './MiniCalendar.css';

class MiniCalendar extends Component {
  constructor(props) {
    super(props);
    this.renderMiniWeekNumbers = this.renderMiniWeekNumbers.bind(this);
  }

  renderMiniWeekNumbers(rowOfDays) {
    const { currentMonth } = this.props;
    const output = [];

    const monthStart = dateFns.startOfMonth(currentMonth);

    for (let index = 0; index < rowOfDays.length; index += 1) {
      const dayRow = [];
      const daysOfCurrentWeek = rowOfDays[index];
      for (let i = 0; i < daysOfCurrentWeek.length; i += 1) {
        const day = daysOfCurrentWeek[i];
        const classes = !dateFns.isSameMonth(day, monthStart) ? 'not-in-month' : 'mini-date-number';
        const formattedDate = dateFns.format(day, 'D');
        dayRow.push(<div className={classes}>{formattedDate}</div>);
      }
      output.push(<div className="mini-event-row">{dayRow}</div>);
    }

    return output;
  }

  render() {
    const { currentMonth, rowOfDays, prevMonth, nextMonth } = this.props;

    const miniWeekDayRow = [
      <div className="mini-calendar-week mini-weekday-row">
        <div className="mini-event-row weekday-header">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
      </div>,
    ];

    return (
      <div className="mini-calendar">
        <div className="width-90 height-90">
          <div className="mini-calendar-header">
            <button onClick={prevMonth} className="mini-nav-button justify-self-end"> &lt; </button>
            <h3 className="mini-month-and-year justify-self-center">
              {currentMonth.toLocaleString('en-us', { month: 'long' })} {currentMonth.getFullYear()}
            </h3>
            <button onClick={nextMonth} className="mini-nav-button justify-self-start"> &gt; </button>
          </div>
          {miniWeekDayRow}
          {this.renderMiniWeekNumbers(rowOfDays).map(row => (
            <div className="mini-calendar-week">
              {row}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MiniCalendar;
