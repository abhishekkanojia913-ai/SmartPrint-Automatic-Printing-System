import { useEffect, useState } from "react";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      getOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container">
      <h1>🖨️ SmartPrint Admin Dashboard</h1>

      <h2>Customer Orders</h2>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "15px 0",
              borderRadius: "10px",
            }}
          >
            <h3>📄 {order.fileName}</h3>

            <p>🖨️ Print Type: {order.printType}</p>
            <p>🔢 Copies: {order.copies}</p>
            <p>📄 Side: {order.side}</p>
            <p>💰 Amount: ₹{order.totalPrice}</p>
            <p>
              📊 Status: <strong>{order.status}</strong>
            </p>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order.id, e.target.value)
              }
            >
              <option value="Pending">Pending 🟡</option>
              <option value="Printing">Printing 🔵</option>
              <option value="Completed">Completed 🟢</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;