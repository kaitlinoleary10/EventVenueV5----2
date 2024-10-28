import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Tickets() {
  const navigate = useNavigate();
  const { eventName, eventDate } = useParams();
  
  const [boxTickets, setBoxTickets] = useState(0);
  const [orchestraTickets, setOrchestraTickets] = useState(0);
  const [mainFloorTickets, setMainFloorTickets] = useState(0);
  const [balconyTickets, setBalconyTickets] = useState(0);
  const [ticketPrices, setTicketPrices] = useState({});

  useEffect(() => {
    // Fetch event data from the JSON file
    fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
      .then((response) => response.json())
      .then((data) => {
        const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
        const foundEvent = data.events.find(
          (e) => e.eventName.toLowerCase() === formattedEventName.toLowerCase()
        );

        if (foundEvent) {
          const eventDetail = foundEvent.eventDetails.find(detail => detail.date === eventDate);
          if (eventDetail) {
            setTicketPrices(eventDetail.ticketPrices);
          }
        }
      })
      .catch((error) => console.error('Error fetching event data:', error));
  }, [eventName, eventDate]);

  const handleAddToCart = () => {
    const cart = {
      box: boxTickets,
      orchestra: orchestraTickets,
      mainFloor: mainFloorTickets,
      balcony: balconyTickets
    };
    const totalTickets = boxTickets + orchestraTickets + mainFloorTickets + balconyTickets;

    if (totalTickets === 0) {
      alert("Please select one or more tickets to add to the cart.");
      return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
  };

  return (
    <div className="tickets-page">
      <h1>Select Your Tickets</h1>
      <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
        Event: {eventName.replace(/-/g, ' ')} 
      </h3>
      <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
        Date: {eventDate} 
      </h3>
    
      <div className="ticket-option">
        <label>Box Tickets (${ticketPrices.box} each):</label>
        <select value={boxTickets} onChange={(e) => setBoxTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br />

      <div className="ticket-option">
        <label>Orchestra Tickets (${ticketPrices.orchestra} each):</label>
        <select value={orchestraTickets} onChange={(e) => setOrchestraTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br />

      <div className="ticket-option">
        <label>Main Floor Tickets (${ticketPrices.mainFloor} each):</label>
        <select value={mainFloorTickets} onChange={(e) => setMainFloorTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br />

      <div className="ticket-option">
        <label>Balcony Tickets (${ticketPrices.balcony} each):</label>
        <select value={balconyTickets} onChange={(e) => setBalconyTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br />

      <button 
        style={{
          display: 'block',
          padding: '10px 20px', 
          fontSize: '16px',     
          fontWeight: 'bold',
          backgroundColor: '#FF6700',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default Tickets;
