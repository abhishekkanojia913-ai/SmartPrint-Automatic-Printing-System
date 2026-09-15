import "./App.css";
import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import Payment from "./Payment";
import { QRCodeSVG } from "qrcode.react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [printType, setPrintType] = useState("bw");
  const [copies, setCopies] = useState(1);
  const [side, setSide] = useState("single");
  const [message, setMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
    setOrderSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a document first!");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      const response = await fetch(
        "https://smartprint-automatic-printing-system.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ File uploaded successfully!");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Server connection failed!");
    }
  };

  const pages = 1;
  const pricePerPage = printType === "bw" ? 2 : 10;

  let totalPrice = pages * copies * pricePerPage;

  if (side === "double") {
    totalPrice += pages * copies * 1;
  }

  // Open Payment Page
  const handleProceedToPayment = () => {
    if (!selectedFile) {
      alert("Please upload a document first!");
      return;
    }

    setShowPayment(true);
  };

  // Create order after payment
  const handlePaymentSuccess = async () => {
    const orderData = {
      fileName: selectedFile.name,
      printType: printType === "bw" ? "Black & White" : "Colour",
      copies: copies,
      side: side === "single" ? "Single Side" : "Double Side",
      totalPrice: totalPrice,
    };

    try {
      const response = await fetch(
        "https://smartprint-automatic-printing-system.onrender.com/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data);

        setShowPayment(false);
        setOrderSuccess(true);
      } else {
        alert("Order creation failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed!");
    }
  };

  // Admin Dashboard
  if (showAdmin) {
    return (
      <div>
        <button
          onClick={() => setShowAdmin(false)}
          style={{ margin: "20px" }}
        >
          ← Back to SmartPrint
        </button>

        <AdminDashboard />
      </div>
    );
  }

  // Payment Page
  if (showPayment) {
    return (
      <Payment
        totalPrice={totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="container">
      <h1>🖨️ SmartPrint</h1>

      <button onClick={() => setShowAdmin(true)}>
        🧑‍💼 Open Admin Dashboard
      </button>

      <h2>QR Based Automatic Printing System</h2>

      {/* QR Code */}
      <div className="qr-section">
        <h3>📱 Scan QR Code to Start Printing</h3>

        <QRCodeSVG
  value={window.location.origin}
  size={180}
/>

        <p>Scan this QR code to open SmartPrint</p>
      </div>

      {/* Upload Document */}
      <div className="section">
        <h3>📄 Upload Document</h3>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <p>
            <strong>Selected File:</strong> {selectedFile.name}
          </p>
        )}

        <button onClick={handleUpload}>
          Upload Document
        </button>

        {message && <p>{message}</p>}
      </div>

      {/* Print Type */}
      <div className="section">
        <h3>🎨 Print Type</h3>

        <select
          value={printType}
          onChange={(e) => setPrintType(e.target.value)}
        >
          <option value="bw">Black & White - ₹2/page</option>
          <option value="color">Colour - ₹10/page</option>
        </select>
      </div>

      {/* Print Side */}
      <div className="section">
        <h3>📄 Print Side</h3>

        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
        >
          <option value="single">Single Side</option>
          <option value="double">Double Side</option>
        </select>
      </div>

      {/* Copies */}
      <div className="section">
        <h3>🔢 Number of Copies</h3>

        <input
          type="number"
          min="1"
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
        />
      </div>

      {/* Price */}
      <div className="price">
        <h2>💰 Total Price: ₹{totalPrice}</h2>
      </div>

      {/* Proceed to Payment */}
      <button
        className="payment-btn"
        onClick={handleProceedToPayment}
      >
        💳 Proceed to Payment
      </button>

      {/* Order Success */}
      {orderSuccess && (
        <div className="success">
          <h2>✅ Payment Successful!</h2>

          <p>Your printing order has been placed successfully.</p>

          <p>
            <strong>Amount Paid: ₹{totalPrice}</strong>
          </p>

          <p>Order Status: Pending 🟡</p>
        </div>
      )}
    </div>
  );
}

export default App;