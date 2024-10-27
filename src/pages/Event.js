import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { FaBookmark } from 'react-icons/fa'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HOME_PATH } from '../App';

function EventPage() {
  const { eventName, eventDate } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [isSaved, setIsSaved] = useState(false);
  const [buttonText, setButtonText] = useState('Save Event');

  useEffect(() => {
    // Fetch the events data from the JSON file
    fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch event data. Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data fetched:' ,data); // Check the fetched data structure
      const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');

      const foundEvent = data.events.find(
        (e) => e.eventName.toLowerCase() === formattedEventName.toLowerCase()
      );

          if (foundEvent) {
              setEvent(foundEvent);
              setSelectedDate(foundEvent.eventDetails[0].date);  // Set the default selected date
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
  }, [eventName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
    }

    // Function to get the prices for the selected date
    const getPricesForDate = (date) => {
        const eventDetail = event.eventDetails.find(detail => detail.date === date);
        return eventDetail ? eventDetail.ticketPrices : {};
    };

    // Handle date selection
    const handleDateChange = (date) => {
        const normalizedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        setSelectedDate(normalizedDate);
    };

    const ticketPrices = getPricesForDate(selectedDate);  // Get the ticket prices for the selected date

    // Format the date range
    const getDateRange = (details) => {
        const sortedDates = details
            .map(detail => {
                const dateParts = detail.date.split('-');
                return new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])); // Use UTC for correct date parsing
            })
            .sort((a, b) => a - b);

        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];

        return `${startDate.toUTCString().split(' ').slice(0, 4).join(' ')} - ${endDate.toUTCString().split(' ').slice(0, 4).join(' ')}`;
    };

    const dateRange = getDateRange(event.eventDetails);

    // Highlight event dates
    const tileClassName = ({ date }) => {
        const eventDates = event.eventDetails.map(detail => new Date(detail.date).toISOString().split('T')[0]);
        const currentDate = date.toISOString().split('T')[0];
        return eventDates.includes(currentDate) ? 'highlight' : null;
    };

    // Disable all other dates except those in the event date range
    const tileDisabled = ({ date }) => {
        const eventDates = event.eventDetails.map(detail => new Date(detail.date).toISOString().split('T')[0]);
        const currentDate = date.toISOString().split('T')[0];
        return !eventDates.includes(currentDate);
    };

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
                    <h1>{event.eventName}</h1>
                    <p>{dateRange} | {event.eventDetails[0].time}</p>
                </div>
            </div>

            <div className="content-grid">
                {/* Left column with "Go Back" button and main content */}
                <div className="left-column">
                    {/* Go Back button */}
                    <div className="top-left-button">
                        <Link to={HOME_PATH} className="go-back-button">Go Back</Link>
                    </div>

                    <div className="event-details">
                        <section className="event-info">
                            <h3>Description</h3>
                            <p>{event.description}</p>

                            <h3>Time</h3>
                            <p>{event.eventDetails[0].time}</p>
                        </section>

                        {/* Ticket Prices and Calendar in the bottom section */}
                        <div className="bottom-section">
                            <div className="calendar-section">
                                <h3>Event Calendar</h3>
                                <Calendar
                                    tileClassName={tileClassName}
                                    tileDisabled={tileDisabled}
                                    onClickDay={handleDateChange}
                                    defaultValue={
                                        new Date(Date.UTC(
                                            selectedDate.split('-')[0],
                                            selectedDate.split('-')[1] - 1,
                                            selectedDate.split('-')[2],
                                            12, 0, 0
                                        ))
                                    }
                                />
                            </div>
                            <table className="ticket-prices-table">
                                <thead>
                                    <tr>
                                        <th>Section</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Box</td>
                                        <td>${ticketPrices.box}</td>
                                    </tr>
                                    <tr>
                                        <td>Orchestra</td>
                                        <td>${ticketPrices.orchestra}</td>
                                    </tr>
                                    <tr>
                                        <td>Main Floor</td>
                                        <td>${ticketPrices.mainFloor}</td>
                                    </tr>
                                    <tr>
                                        <td>Balcony</td>
                                        <td>${ticketPrices.balcony}</td>
                                    </tr>
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>

                {/* Right column for the button group */}
                <div className="right-column">
                    <div className="top-right-buttons">
                        <Link to={`/tickets/${eventName}/${eventDate}`}>
                            <button className="buy-tickets-button">Buy Tickets!</button>
                        </Link>

                        <button
                            className="save-event-button"
                            onClick={() => setIsSaved(!isSaved)}
                            onMouseEnter={() => setButtonText(isSaved ? 'Unsave' : 'Save Event')}
                            onMouseLeave={() => setButtonText(isSaved ? 'Saved' : 'Save Event')}
                        >
                            <FaBookmark className={`save-icon ${isSaved ? 'saved' : 'unsaved'}`} />
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default EventPage;
