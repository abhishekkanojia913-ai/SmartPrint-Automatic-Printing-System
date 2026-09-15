const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary orders array
const orders = [];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Test route
app.get("/", (req, res) => {
  res.send("SmartPrint Server is Running!");
});

// File upload route
app.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
  });
});

// Create Order
app.post("/orders", (req, res) => {
  const {
    fileName,
    printType,
    copies,
    side,
    totalPrice,
  } = req.body;

  const newOrder = {
    id: Date.now(),
    fileName,
    printType,
    copies,
    side,
    totalPrice,
    status: "Pending",
  };

  orders.push(newOrder);

  res.status(201).json({
    message: "Order created successfully!",
    order: newOrder,
  });
});

// Get All Orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Update Order Status
app.put("/orders/:id", (req, res) => {
  const orderId = Number(req.params.id);

  const order = orders.find(
    (item) => item.id === orderId
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  order.status = req.body.status;

  res.json({
    message: "Order status updated!",
    order,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});