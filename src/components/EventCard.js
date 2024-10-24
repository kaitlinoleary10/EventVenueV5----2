import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import { FaBookmark } from 'react-icons/fa'; // Importing the bookmark icon

function EventCard({ event }) {
  const [savedEvents, setSavedEvents] = useState({}); // State to track saved dates for each event

  // Toggle save state for a specific date
  const handleSaveClick = (date) => {
    setSavedEvents((prevState) => ({
      ...prevState,
      [date]: !prevState[date],  // Toggle the saved state for the specific date
    }));
  };

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="row">
      {event.eventDetails.map((detail, index) => (
        <article className="card fl-left" key={index}>
          <section className="date">
            <time dateTime={detail.date}>
              <span>{new Date(detail.date).getDate()}</span>
              <span>{new Date(detail.date).toLocaleString('default', { month: 'short' })}</span>
            </time>
          </section>
          <section className="card-cont">
            <small>{event.category}</small> {/* Category is already displayed */}
            <h3>{event.eventName}</h3>
            <p>{truncateDescription(event.description, 100)}</p>

            <div className="even-date">
              <i className="fa fa-calendar"></i>
              <time>
                <span>{new Date(detail.date).toDateString()}</span>
                <span>{detail.time}</span>
              </time>
            </div>
            <div className="even-info">
              <i className="fa fa-map-marker"></i>
              <p>{event.location}</p>
            </div>
            <div className="button-group">
              {/* Link to event details */}
              <Link
                to={`/event/${event.eventName.replace(/\s+/g, '-').toLowerCase()}/${detail.date}`}
                className="details-button"
              >
                Details
              </Link>

              {/* Save button, now placed to the right of Details */}
              <button className="save-button" onClick={() => handleSaveClick(detail.date)}>
                <FaBookmark
                  className={`save-icon ${savedEvents[detail.date] ? 'saved' : 'unsaved'}`}
                />
              </button>
            </div>
          </section>
        </article>
      ))}
    </div>
  );
}

export default EventCard;
