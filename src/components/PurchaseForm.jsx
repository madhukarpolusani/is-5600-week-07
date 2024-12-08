import React, { useState } from 'react';
import { useCart } from '../state/CartProvider'; // Import useCart from context
import { BASE_URL } from '../config';

export default function PurchaseForm() {
  const { cartItems, getCartTotal } = useCart(); // Access cart data and total
  const [buyerEmail, setBuyerEmail] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!buyerEmail) {
      setMessage('Please provide a valid email address.');
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }

    const order = {
      buyerEmail,
      products: cartItems.map((item) => ({
        id: item._id,
        quantity: item.quantity,
      })),
      totalAmount: getCartTotal(),
      status: 'PENDING',
    };

    fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create order.');
        }
        return res.json();
      })
      .then((data) => {
        setMessage('Order placed successfully!');
        setBuyerEmail(''); // Clear email input
        console.log('Order created:', data);
        // Optionally, you could clear the cart here using a context method
      })
      .catch((error) => {
        setMessage('Error creating order. Please try again.');
        console.error('Error:', error);
      });
  };

  return (
    <form className="pt4 pb4 pl2 black-80 w-50" onSubmit={handleSubmit}>
      <fieldset className="cf bn ma0 pa0">
        <div className="cf mb2">
          <input
            className="f6 f5-l input-reset fl black-80 ba b--black-20 bg-white pa3 lh-solid w-100 w-70-l br2-ns br--left-ns"
            placeholder="Email Address"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            type="email"
          />
          <input
            className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-30-l br2-ns br--right-ns"
            type="submit"
            value="Purchase"
          />
        </div>
        <small id="name-desc" className="f6 black-60 db mb2">
          Enter your email address to complete purchase
        </small>
        {message && <p className="f6 red">{message}</p>}
      </fieldset>
    </form>
  );
}
