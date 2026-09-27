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

  const API_URL =
    "https://smartprint-automatic-printing-system.onrender.com";

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setSelectedFile(file);
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
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

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

  const pricePerPage =
    printType === "bw" ? 2 : 10;

  let totalPrice =
    pages * copies * pricePerPage;

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

      printType:
        printType === "bw"
          ? "Black & White"
          : "Colour",

      copies: copies,

      side:
        side === "single"
          ? "Single Side"
          : "Double Side",

      totalPrice: totalPrice,
    };

    try {
      const response = await fetch(
        `${API_URL}/orders`,
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

  /* ADMIN */

  if (showAdmin) {
    return (
      <div className="admin-page">
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

  /* PAYMENT */

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
    <div className="app-background">

      <div className="container">

        {/* TOP BAR */}

        <div className="top-bar">

          <div className="brand">

            <div className="brand-icon">
              🖨️
            </div>

            <div>
              <h1>SmartPrint</h1>

              <p>
                Print smarter. Print faster.
              </p>
            </div>

          </div>

          <button
            className="admin-btn"
            onClick={() => setShowAdmin(true)}
          >
            🧑‍💼 Admin
          </button>

        </div>

        {/* HERO */}

        <div className="hero">

          <div className="hero-badge">
            ⚡ Fast & Easy Printing
          </div>

          <h2>
            Your Documents.
            <br />
            <span>Printed Smarter.</span>
          </h2>

          <p>
            Upload your document, choose your
            printing preferences and place your
            order in just a few clicks.
          </p>

        </div>

        {/* QR */}

        <div className="qr-card">

          <div className="qr-content">

            <div className="qr-text">

              <span className="step-number">
                01
              </span>

              <div>
                <h3>
                  Scan to Start
                </h3>

                <p>
                  Scan this QR code to open
                  SmartPrint on your phone.
                </p>
              </div>

            </div>

            <div className="qr-wrapper">

              <QRCodeSVG
                value={window.location.origin}
                size={170}
              />

            </div>

          </div>

          <div className="qr-footer">
            📱 Scan • 📄 Upload • 🖨️ Print
          </div>

        </div>

        {/* UPLOAD */}

        <div className="section modern-section">

          <div className="section-heading">

            <span className="step-number">
              02
            </span>

            <div>
              <h3>
                Upload Document
              </h3>

              <p>
                PDF, DOC or DOCX files
              </p>
            </div>

          </div>

          <label className="upload-box">

            <div className="upload-icon">
              📄
            </div>

            <strong>
              {selectedFile
                ? selectedFile.name
                : "Choose your document"}
            </strong>

            <span>
              {selectedFile
                ? `${(
                    selectedFile.size /
                    1024
                  ).toFixed(1)} KB`
                : "Click here to browse files"}
            </span>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

          </label>

          <button
            className="upload-btn"
            onClick={handleUpload}
          >
            ⬆ Upload Document
          </button>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </div>

        {/* PRINT TYPE */}

        <div className="modern-section">

          <div className="section-heading">

            <span className="step-number">
              03
            </span>

            <div>
              <h3>
                Choose Print Type
              </h3>

              <p>
                Select the printing quality you need
              </p>
            </div>

          </div>

          <div className="option-grid">

            <button
              className={`option-card ${
                printType === "bw"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setPrintType("bw")
              }
            >

              <span className="option-icon">
                ⚫
              </span>

              <span>
                <strong>
                  Black & White
                </strong>

                <small>
                  ₹2 per page
                </small>
              </span>

              {printType === "bw" && (
                <b>✓</b>
              )}

            </button>

            <button
              className={`option-card ${
                printType === "color"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setPrintType("color")
              }
            >

              <span className="option-icon">
                🌈
              </span>

              <span>
                <strong>
                  Colour
                </strong>

                <small>
                  ₹10 per page
                </small>
              </span>

              {printType === "color" && (
                <b>✓</b>
              )}

            </button>

          </div>

        </div>

        {/* SIDE */}

        <div className="modern-section">

          <div className="section-heading">

            <span className="step-number">
              04
            </span>

            <div>
              <h3>
                Print Side
              </h3>

              <p>
                Choose how your document should be printed
              </p>
            </div>

          </div>

          <div className="option-grid">

            <button
              className={`option-card ${
                side === "single"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSide("single")
              }
            >

              <span className="option-icon">
                📄
              </span>

              <span>
                <strong>
                  Single Side
                </strong>

                <small>
                  One side of the paper
                </small>
              </span>

              {side === "single" && (
                <b>✓</b>
              )}

            </button>

            <button
              className={`option-card ${
                side === "double"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSide("double")
              }
            >

              <span className="option-icon">
                📑
              </span>

              <span>
                <strong>
                  Double Side
                </strong>

                <small>
                  Both sides of the paper
                </small>
              </span>

              {side === "double" && (
                <b>✓</b>
              )}

            </button>

          </div>

        </div>

        {/* COPIES */}

        <div className="modern-section">

          <div className="section-heading">

            <span className="step-number">
              05
            </span>

            <div>
              <h3>
                Number of Copies
              </h3>

              <p>
                Select how many copies you need
              </p>
            </div>

          </div>

          <div className="copies-control">

            <button
              className="copy-btn"
              onClick={() =>
                setCopies(
                  Math.max(
                    1,
                    copies - 1
                  )
                )
              }
            >
              −
            </button>

            <div className="copy-number">
              {copies}
              <small>
                copies
              </small>
            </div>

            <button
              className="copy-btn"
              onClick={() =>
                setCopies(
                  copies + 1
                )
              }
            >
              +
            </button>

          </div>

        </div>

        {/* PRICE */}

        <div className="price-card">

          <div>
            <span>
              Total Amount
            </span>

            <small>
              {copies} copy ×{" "}
              {printType === "bw"
                ? "B&W"
                : "Colour"}
            </small>
          </div>

          <strong>
            ₹{totalPrice}
          </strong>

        </div>

        {/* PAYMENT */}

        <button
          className="payment-btn"
          onClick={handleProceedToPayment}
        >
          <span>
            Proceed to Payment
          </span>

          <span className="payment-arrow">
            →
          </span>
        </button>

        {/* SUCCESS */}

        {orderSuccess && (

          <div className="success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Order Placed!
            </h2>

            <p>
              Your printing order has been
              successfully received.
            </p>

            <div className="success-details">

              <div>
                <span>
                  Amount Paid
                </span>

                <strong>
                  ₹{totalPrice}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  Pending 🟡
                </strong>
              </div>

            </div>

          </div>

        )}

        {/* FOOTER */}

        <div className="footer">
          <strong>
            SmartPrint
          </strong>

          <span>
            Simple • Fast • Convenient
          </span>
        </div>

      </div>

    </div>
  );
}

export default App;