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

  const handleProceedToPayment = () => {
    if (!selectedFile) {
      alert("Please upload a document first!");
      return;
    }

    setShowPayment(true);
  };

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

  /* ================= ADMIN ================= */

  if (showAdmin) {
    return (
      <div>
        <button
          className="back-btn"
          onClick={() => setShowAdmin(false)}
        >
          ← Back to SmartPrint
        </button>

        <AdminDashboard />
      </div>
    );
  }

  /* ================= PAYMENT ================= */

  if (showPayment) {
    return (
      <Payment
        totalPrice={totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  /* ================= MAIN PAGE ================= */

  return (
    <div className="container">

      {/* Brand */}

      <div className="brand">
        <div className="brand-icon">
          🖨️
        </div>

        <div>
          <h1>SmartPrint</h1>
          <p>Print smarter. Print faster.</p>
        </div>
      </div>

      {/* Admin */}

      <button
        className="admin-btn"
        onClick={() => setShowAdmin(true)}
      >
        🧑‍💼 Admin Dashboard
      </button>

      {/* Subtitle */}

      <div className="hero-text">
        <h2>QR Based Automatic Printing System</h2>

        <p>
          Upload your document, choose your printing preferences,
          and place your order easily.
        </p>
      </div>

      {/* QR Code */}

      <div className="qr-section">

        <div className="qr-title">
          <span>📱</span>

          <div>
            <h3>Start Printing</h3>
            <p>Scan the QR code to open SmartPrint</p>
          </div>
        </div>

        <QRCodeSVG
          value={window.location.origin}
          size={180}
        />

        <div className="qr-hint">
          Scan • Upload • Print
        </div>

      </div>

      {/* Upload */}

      <div className="section">

        <h3>📄 Upload Document</h3>

        <p className="section-description">
          Upload your PDF or document for printing.
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <div className="file-selected">
            <span>📄</span>

            <div>
              <strong>{selectedFile.name}</strong>
              <small>Document selected</small>
            </div>
          </div>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Upload Document
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

      </div>

      {/* Print Type */}

      <div className="section">

        <h3>🎨 Print Type</h3>

        <p className="section-description">
          Choose your preferred printing type.
        </p>

        <select
          value={printType}
          onChange={(e) => setPrintType(e.target.value)}
        >
          <option value="bw">
            Black & White - ₹2/page
          </option>

          <option value="color">
            Colour - ₹10/page
          </option>
        </select>

      </div>

      {/* Print Side */}

      <div className="section">

        <h3>📄 Print Side</h3>

        <p className="section-description">
          Select single or double-sided printing.
        </p>

        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
        >
          <option value="single">
            Single Side
          </option>

          <option value="double">
            Double Side
          </option>
        </select>

      </div>

      {/* Copies */}

      <div className="section">

        <h3>🔢 Number of Copies</h3>

        <p className="section-description">
          Select how many copies you need.
        </p>

        <div className="copies-control">

          <button
            className="copy-btn"
            onClick={() =>
              setCopies(Math.max(1, copies - 1))
            }
          >
            −
          </button>

          <span>{copies}</span>

          <button
            className="copy-btn"
            onClick={() =>
              setCopies(copies + 1)
            }
          >
            +
          </button>

        </div>

      </div>

      {/* Price */}

      <div className="price">

        <span>Total Amount</span>

        <strong>
          ₹{totalPrice}
        </strong>

      </div>

      {/* Payment */}

      <button
        className="payment-btn"
        onClick={handleProceedToPayment}
      >
        Proceed to Payment
        <span>→</span>
      </button>

      {/* Success */}

      {orderSuccess && (

        <div className="success">

          <div className="success-icon">
            ✓
          </div>

          <h2>Order Placed Successfully!</h2>

          <p>
            Your printing order has been received.
          </p>

          <div className="success-details">

            <div>
              <span>Amount Paid</span>
              <strong>₹{totalPrice}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>Pending 🟡</strong>
            </div>

          </div>

        </div>

      )}

      {/* Footer */}

      <div className="footer">
        SmartPrint • Simple. Fast. Convenient.
      </div>

    </div>
  );
}

export default App;