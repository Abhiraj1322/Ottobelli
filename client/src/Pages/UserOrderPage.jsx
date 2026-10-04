import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success || Array.isArray(res.data)) {
          setOrders(res.data.orders || res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
        setError(err.response?.data?.message || "Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6 text-gray-500">
        <p className="text-xs font-semibold uppercase tracking-wider">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Order History</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-black px-5 py-2.5 text-xs font-semibold uppercase text-white hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                <div>
                  <span className="text-gray-500">Order ID:</span>{" "}
                  <span className="font-mono font-bold text-gray-800">{order._id}</span>
                </div>
                <div className="text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="my-3 space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.productId?.name || item.name || "Product"} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${((item.price || item.priceAtAdd || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 font-bold uppercase text-green-700">
                    {order.paymentStatus || "Paid"}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-bold uppercase text-blue-700">
                    {order.orderStatus || "Processing"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-gray-900">
                    Total: ${order.total?.toFixed(2)}
                  </span>
                  <Link
                    to={`/order-confirmation/${order._id}`}
                    className="font-semibold text-black underline hover:text-gray-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}