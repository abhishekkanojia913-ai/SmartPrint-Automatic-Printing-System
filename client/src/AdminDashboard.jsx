import { useEffect, useState } from "react";

const API_URL =
  "https://smartprint-automatic-printing-system.onrender.com";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        getOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>🖨️ SmartPrint</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="order-count">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
      </div>

      <div className="admin-title">
        <h2>Customer Orders</h2>
        <button
          className="refresh-btn"
          onClick={getOrders}
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="empty-orders">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <div>📭</div>
          <h3>No Orders Yet</h3>
          <p>Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>

              <div className="order-top">
                <div>
                  <span className="order-label">
                    Order ID
                  </span>

                  <strong className="order-id">
                    {order.orderId || `SP-${order.id}`}
                  </strong>
                </div>

                <span
                  className={`status-badge ${order.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.status === "Pending" && "🟡 "}
                  {order.status === "Printing" && "🔵 "}
                  {order.status === "Completed" && "🟢 "}
                  {order.status}
                </span>
              </div>

              <div className="order-file">
                <span>📄</span>

                <div>
                  <strong>{order.fileName}</strong>
                  <small>Printing Document</small>
                </div>
              </div>

              <div className="order-details">

                <div>
                  <span>🖨️ Print Type</span>
                  <strong>{order.printType}</strong>
                </div>

                <div>
                  <span>📄 Side</span>
                  <strong>{order.side}</strong>
                </div>

                <div>
                  <span>🔢 Copies</span>
                  <strong>{order.copies}</strong>
                </div>

                <div>
                  <span>💰 Amount</span>
                  <strong>₹{order.totalPrice}</strong>
                </div>

              </div>

              <div className="order-meta">

                <span>
                  📅 {order.orderDate || "Date unavailable"}
                </span>

                <span>
                  🕐 {order.orderTime || "Time unavailable"}
                </span>

              </div>

              <div className="status-control">

                <label>Update Order Status</label>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(
                      order.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending 🟡
                  </option>

                  <option value="Printing">
                    Printing 🔵
                  </option>

                  <option value="Completed">
                    Completed 🟢
                  </option>
                </select>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;