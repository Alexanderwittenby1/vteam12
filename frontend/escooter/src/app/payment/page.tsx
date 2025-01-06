'use client'; 

import { useState, useEffect  } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { fetchUserData } from "../../services/fetchUserData";


console.log(loadStripe);
const stripePromise = loadStripe('pk_test_51QVGmWRoXcO6JWu3lQaHYWRGwBugOpHCTS5b7OfipoM9S7vI14eNnStSgp7dSHJZKJpNfIVG6AZGMAPkrytdyVFS00ktOqdKob'); // Ersätt med din Stripe publishable key

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState(''); // Spara användarens valda belopp
  const [user, setUser] = useState(null);
    
  
    useEffect(() => {
      const getUserData = async () => {
        const userId = await fetchUserData();
        setUser(userId.user_id);
        
      };
  
      getUserData();
    }, []);
      
  console.log("Userid -->",user);

 

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage(''); 
    

    if (!amount || isNaN(amount) || amount <= 0) {
      setErrorMessage('Vänligen ange ett giltigt belopp.');
      setLoading(false);
      return;
    }

    const amountInCents = Math.round(parseFloat(amount) * 100); // Omvandla till öre (cent)

    try {
      // Skicka begäran till backend för att skapa en Stripe Checkout-session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              name: 'Donation', // Du kan anpassa produktens namn
              amount: amountInCents, // Skicka beloppet i öre
              quantity: 1, // Antal produkter (en)
            },
          ],
          userId: user
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { id } = await response.json(); // Ta emot sessionId från backend
      

      // Ladda Stripe och omdirigera till checkout
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: id, // Använd det sessionId som backend skickade
        });

        if (error) {
          console.error('Stripe error:', error);
          setErrorMessage(error.message); // Visa Stripe-felmeddelandet för användaren
        }
      } else {
        setErrorMessage('Stripe could not be loaded. Please try again later.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setErrorMessage('An error occurred while processing your payment. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Checkout</h1>
      
      <div className="form-group">
        <label htmlFor="amount">Ange belopp (SEK):</label>
        <input
          type="number"
          id="amount"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Skriv beloppet här"
        />
      </div>

      <button
        className={`btn btn-primary ${loading ? 'disabled' : ''}`}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Redirecting to checkout...' : 'Betala med Stripe'}
      </button>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Checkout;



