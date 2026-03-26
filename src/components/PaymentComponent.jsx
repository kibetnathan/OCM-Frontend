import React from 'react';

const PaymentComponent = ({ amount, email, orderId }) => {
  
  const handlePayment = () => {
    // 1. Initialize the popup
    const paystack = new window.PaystackPop();

    // 2. Start the transaction
    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Amount in subunits (e.g. 1000 KES = 100000)
      currency: 'KES',      
      reference: orderId,
      
      onSuccess: (transaction) => {

        console.log('Payment complete! Reference:', transaction.reference);
        verifyOnBackend(transaction.reference);
      },
      onCancel: () => {
        alert("Transaction cancelled.");
      },
      onError: (error) => {
        console.error("Error:", error.message);
      }
    });
  };

  const verifyOnBackend = async (ref) => {
    try {
      const response = await fetch('http://localhost:8000/api/verify-payment/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: ref }),
      });
      const data = await response.json();
      if (data.status === 'verified') {
        alert("Payment Confirmed in Backend!");
      }
    } catch (err) {
      console.error("Backend verification failed", err);
    }
  };

  return (
    <button onClick={handlePayment} className="pay-btn">
      Pay with M-PESA or Card
    </button>
  );
};

export default PaymentComponent;
