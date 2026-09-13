import { useState } from "react";

function Payment({ totalPrice, onPaymentSuccess, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const handlePayment = () => {
    alert("Payment Successful! ₹" + totalPrice);

    onPaymentSuccess();
  };

  return (
    <div className="container">
      <h1>💳 SmartPrint Payment</h1>

      <h2>Total Amount: ₹{totalPrice}</h2>

      <div className="section">
        <h3>Select Payment Method</h3>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="upi">📱 UPI Payment</option>
          <option value="card">💳 Card Payment</option>
          <option value="cash">💵 Cash at Shop</option>
        </select>
      </div>

      {paymentMethod === "upi" && (
        <div className="section">
          <h3>📱 Pay using UPI</h3>
          <p>UPI ID: smartprint@upi</p>
          <p>Amount: ₹{totalPrice}</p>
        </div>
      )}

      {paymentMethod === "card" && (
        <div className="section">
          <h3>💳 Card Payment</h3>
          <p>This is a demo payment option for the college project.</p>
        </div>
      )}

      {paymentMethod === "cash" && (
        <div className="section">
          <h3>💵 Cash Payment</h3>
          <p>Pay the amount when you collect your print.</p>
        </div>
      )}

      <button className="payment-btn" onClick={handlePayment}>
        ✅ Confirm Payment ₹{totalPrice}
      </button>

      <br />
      <br />

      <button onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

export default Payment;