import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { FaBookmark } from 'react-icons/fa';  // Importing the bookmark icon

function EventPage() {
  const { eventName, eventDate } = useParams(); // get URL parameters
  const [event, setEvent] = useState(null); // store the event object
  const [loading, setLoading] = useState(true); // handle loading state
  const [error, setError] = useState(null); // handle any fetch errors
  const [isSaved, setIsSaved] = useState(false);  // State for saving the event
  const [buttonText, setButtonText] = useState('Save Event');  // Track the button text

  useEffect(() => {
    // Fetch the events data from the JSON file
    fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`) // Change the path accordingly
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch event data. Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');

        const foundEvent = data.events.find(
          (e) => e.eventName.toLowerCase() === formattedEventName.toLowerCase()
        );

        if (foundEvent) {
          const foundEventDetail = foundEvent.eventDetails.find(
            (detail) => detail.date === eventDate
          );

          if (foundEventDetail) {
            setEvent({
              ...foundEvent,
              date: foundEventDetail.date,
              time: foundEventDetail.time,
              ticketPrices: foundEventDetail.ticketPrices,
              description: foundEvent.description,
            });
          } else {
            setError('Event details not found for the specified date.');
          }
        } else {
          setError('Event not found.');
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching event data.');
        setLoading(false);
      });
  }, [eventName, eventDate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Handle save button click
  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    setButtonText(isSaved ? 'Save Event' : 'Saved');  // Toggle between "Save Event" and "Saved"
  };

  // Handle mouse hover over the button
  const handleMouseEnter = () => {
    if (isSaved) {
      setButtonText('Unsave');  // Change to "Unsave" when hovering over a saved event
    }
  };

  // Handle mouse leaving the button
  const handleMouseLeave = () => {
    if (isSaved) {
      setButtonText('Saved');  // Change back to "Saved" when the mouse leaves the button
    } else {
      setButtonText('Save Event');  // Change back to "Save Event" when the event is not saved
    }
  };

  return (
    <div className="event-page">
      {/* Large banner at the top */}
      <div className="event-banner" style={{ backgroundImage: 'url("/path-to-banner-image.jpg")' }}>
        <div className="overlay">
          <h1>{event.eventName.replace(/-/g, ' ')}</h1>
          <p>{event.date} | {event.time}</p>
        </div>
      </div>

      <div className="event-details">
        <section className="event-info">
          <h3>Description</h3>
          <p>{event.description}</p>

          <h3>Date</h3>
          <p>{event.date}</p>

          <h3>Time</h3>
          <p>{event.time}</p>

          <h3>Ticket Prices</h3>
          <ul>
            <li>Box: ${event.ticketPrices.box}</li>
            <li>Orchestra: ${event.ticketPrices.orchestra}</li>
            <li>Main Floor: ${event.ticketPrices.mainFloor}</li>
            <li>Balcony: ${event.ticketPrices.balcony}</li>
          </ul>
        </section>

        <div className="button-group">
          <Link to="/">
            <button className="go-back-button">Go Back</button>
          </Link>

          <Link to="/Tickets">
            <button className="buy-tickets-button">Buy Tickets!</button>
          </Link>

          {/* Save For Later button */}
          <button
            className="save-event-button"
            onClick={handleSaveClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FaBookmark className={`save-icon ${isSaved ? 'saved' : 'unsaved'}`} />
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
