import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';

function Tickets() {
  const navigate = useNavigate();
  const { eventName, eventDate } = useParams();
  
  const [boxTickets, setBoxTickets] = useState(0);
  const [orchestraTickets, setOrchestraTickets] = useState(0);
  const [mainFloorTickets, setMainFloorTickets] = useState(0);
  const [balconyTickets, setBalconyTickets] = useState(0);

  const ticketPrices = {
    box: 300.00,
    orchestra: 200.00,
    mainFloor: 150.00,
    balcony: 100.00
  };

  const handleAddToCart = () => {
    const cart = {
      box: boxTickets,
      orchestra: orchestraTickets,
      mainFloor: mainFloorTickets,
      balcony: balconyTickets
    };
    const totalTickets = boxTickets + orchestraTickets + mainFloorTickets + balconyTickets 

    //check if total tickets selected is more than 0 
    if (totalTickets === 0){
      alert("Please select one or more tickets to add tickets to the cart."); 
    return; 
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
  };

  return (
    <div className="tickets-page">
      <h1>Select Your Tickets</h1>
      <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
        Event: {eventName.replace(/-/g, ' ')} </h3>

        <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
        Date: {eventDate} </h3>
    
      <div className="ticket-option">
        <label>Box Tickets ($300.00 each):</label>
        <select value={boxTickets} onChange={(e) => setBoxTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br /> 


      <div className="ticket-option">
        <label>Orchestra Tickets ($200.00 each):</label>
        <select value={orchestraTickets} onChange={(e) => setOrchestraTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br /> 


      <div className="ticket-option">
        <label>Main Floor Tickets ($150.00 each):</label>
        <select value={mainFloorTickets} onChange={(e) => setMainFloorTickets(Number(e.target.value))}>
          {[...Array(11).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <br /> 



      <div className="ticket-option">
        <label>Balcony Tickets ($100.00 each):</label>
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
