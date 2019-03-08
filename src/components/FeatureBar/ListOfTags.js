/* eslint-disable react/jsx-filename-extension, arrow-body-style */
import React from 'react';
import Tag from './Tag';

import './ListOfTags.css';

const ListOfTags = ({ eventsForFeatureBar, selectEvent, editEvent, deleteEvent }) => {
  return (
    <div className="list-of-tags">
      <div className="feature-bar-divider" />
      <h2 className="title-for-tags">Events for the month:</h2>
      {eventsForFeatureBar.length ? eventsForFeatureBar.map(
        event => (
          <Tag
            event={event}
            selectEvent={selectEvent}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        ),
      )
        : <div className="no-tags">No Events</div>
      }
    </div>
  );
};

export default ListOfTags;