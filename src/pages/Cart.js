import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const { eventName, eventDate } = useParams();
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrices, setTicketPrices] = useState({});

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);

      // Fetch event prices dynamically
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
    }
  }, [eventName, eventDate]);

  useEffect(() => {
    if (cart && ticketPrices) {
      const total = (cart.box * ticketPrices.box) +
                    (cart.orchestra * ticketPrices.orchestra) +
                    (cart.mainFloor * ticketPrices.mainFloor) +
                    (cart.balcony * ticketPrices.balcony);
      setTotalPrice(total);
    }
  }, [cart, ticketPrices]);

  const handlePurchase = () => {
    if (cart) {
      const totalTickets = cart.box + cart.orchestra + cart.mainFloor + cart.balcony;
      if (totalTickets === 0) {
        alert("Error: You cannot proceed with 0 tickets in your cart. Please select at least one ticket.");
        return;
      }

      const purchaseData = {
        showName: eventName.replace(/-/g, ' '),
        eventDate: eventDate,
        totalTickets: totalTickets,
        boxTickets: cart.box,
        orchestraTickets: cart.orchestra,
        mainFloorTickets: cart.mainFloor,
        balconyTickets: cart.balcony,
        totalPrice: totalPrice
      };

      navigate('/confirmation', { state: purchaseData });
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
        Event: {eventName.replace(/-/g, ' ')}
      </h3>

      <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
        Date: {eventDate}
      </h3>

      {cart ? (
        <div>
          <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
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
            onClick={handlePurchase}
          >
            Purchase
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
