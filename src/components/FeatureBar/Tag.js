/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import './Tag.css';

const Tag = ({event, selectEvent, editEvent, deleteEvent}) => {
  const editButton = <span onClick={(e) => { editEvent(e, event, event)}} className="tag-edit">Edit Event</span>;
  const deleteButton = <span onClick={(e) => { deleteEvent(e, event)}} className="tag-edit">Delete Event</span>;
  const start = event.start.split('-');
  const end = event.end.split('-');
  const startDate = `${start[1]}-${start[2]}-${start[0]}`;
  const endDate = `${end[1]}-${end[2]}-${end[0]}`;

  return (
    <div className="tag" tabIndex={0} onClick={(e) => { selectEvent(e, event)}}>
      <div className="tag-title">{event.name}</div>
      <div> {editButton} | {deleteButton} </div>
      <div className="tag-duration">{startDate} - {endDate}</div>
      <div className="tag-notes-container">
        Notes:
        <div className="tag-notes">
          {event.notes ?
            <div>{event.notes}</div>
            : <div>N/A</div>
          }
        </div>
      </div>
    </div>
  );
};

export default Tag;