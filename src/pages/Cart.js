import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);

      // Calculate total price
      const ticketPrices = {
        box: 300.00,
        orchestra: 200.00,
        mainFloor: 150.00,
        balcony: 100.00
      };
      
      const total = (parsedCart.box * ticketPrices.box) +
                    (parsedCart.orchestra * ticketPrices.orchestra) +
                    (parsedCart.mainFloor * ticketPrices.mainFloor) +
                    (parsedCart.balcony * ticketPrices.balcony);
      
      setTotalPrice(total);
    }
  }, []);

  // Function to calculate the total price
  const calculateTotalPrice = (updatedCart) => {
    const ticketPrices = {
      box: 300.00,
      orchestra: 200.00,
      mainFloor: 150.00,
      balcony: 100.00,
    };

    const total = (updatedCart.box * ticketPrices.box) +
                  (updatedCart.orchestra * ticketPrices.orchestra) +
                  (updatedCart.mainFloor * ticketPrices.mainFloor) +
                  (updatedCart.balcony * ticketPrices.balcony);
    setTotalPrice(total);
  };

  // Function to handle changes in ticket quantities
  const handleTicketChange = (type, value) => {
    const updatedCart = {
      ...cart,
      [type]: Number(value),
    };
    setCart(updatedCart);
    calculateTotalPrice(updatedCart);  // Recalculate the total price
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Update localStorage
  };

  // Function to handle the purchase button click
  const handlePurchase = () => {
    if (cart) {
      const totalTickets = cart.box + cart.orchestra + cart.mainFloor + cart.balcony;

      if (totalTickets === 0) {
        alert("Error: You cannot proceed with 0 tickets in your cart. Please select at least one ticket.");
        return; // Prevent the purchase process if no tickets are selected
      }

      // If there are tickets, proceed with purchase
      alert("Purchase functionality not implemented.");
    }
  };
  
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart ? (
        <div>
          <div className="ticket-selection">
            <label>Box Tickets:</label>
            <select value={cart.box} onChange={(e) => handleTicketChange('box', e.target.value)}>
              {[...Array(11).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="ticket-selection">
            <label>Orchestra Tickets:</label>
            <select value={cart.orchestra} onChange={(e) => handleTicketChange('orchestra', e.target.value)}>
              {[...Array(11).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="ticket-selection">
            <label>Main Floor Tickets:</label>
            <select value={cart.mainFloor} onChange={(e) => handleTicketChange('mainFloor', e.target.value)}>
              {[...Array(11).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="ticket-selection">
            <label>Balcony Tickets:</label>
            <select value={cart.balcony} onChange={(e) => handleTicketChange('balcony', e.target.value)}>
              {[...Array(11).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
          <button onClick={handlePurchase}>Purchase</button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;