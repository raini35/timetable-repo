/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import './CalendarHeader.css';

const CalendarHeader = ({prevMonthClick, nextMonthClick, prevMonthButton, nextMonthButton, currentMonth}) => {
  return (
    <div className="top-header">
      <div className="justify-self-end">
        <button type="button" className="nav-button" onClick={prevMonthClick}>{prevMonthButton}</button>
      </div>
      <h2
        className="month-and-year justify-self-center"
      >
        {currentMonth.toLocaleString('en-us', { month: 'long' })} {currentMonth.getFullYear()}
      </h2>
      <div className="justify-self-start">
        <button type="button" className="nav-button" onClick={nextMonthClick}>{nextMonthButton}</button>
      </div>
    </div>
  );
};

export default CalendarHeader;
