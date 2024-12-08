import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true); // Set loading to true
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(`${BASE_URL}/orders`); // Fetch from API
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data); // Update state with fetched orders
    } catch (err) {
      setError(err.message); // Update error state if fetch fails
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="center mw7 ba mv4">
      <div className="bg-white pa3 mb3">
        <h2 className="f2 mb2">Orders</h2>

        {/* Display loading, error, or no orders message */}
        {loading && <p>Loading orders...</p>}
        {error && <p className="red">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

        {/* Display orders in a table */}
        {!loading && !error && orders.length > 0 && (
          <table className="w-100">
            <thead>
              <tr>
                <th className="tl pv2">Order ID</th>
                <th className="tl pv2">Buyer Email</th>
                <th className="tl pv2">Products</th>
                <th className="tl pv2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="tl pv2">{order._id}</td>
                  <td className="tl pv2">{order.buyerEmail}</td>
                  <td className="tl pv2">
                    {Array.isArray(order.products)
                      ? order.products.join(', ')
                      : 'No products'}
                  </td>
                  <td className="tl pv2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
