import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/orders/${orderId}/status`,
        { orderStatus: newStatus, isDelivered: newStatus === "Delivered" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh order list after update
      fetchAllOrders();
    } catch (err) {
      alert("Failed to update status");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6 text-gray-500">
        <p className="text-xs font-semibold uppercase tracking-wider">Loading admin orders...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 sm:p-10">
      {/* Header with Navigation Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Orders Dashboard</h1>
          <p className="text-xs text-gray-500">Manage customer purchases and monitor delivery addresses</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800 border border-gray-200">
            Total Orders: {orders.length}
          </span>

          {/* Bulk Upload Button */}
          <Link
            to="/admin/bulk-upload"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Bulk Upload Products
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Order ID & Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Delivery Address</th>
              <th className="px-4 py-3">Items Purchased</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const addr = order.shippingAddress || {};
              return (
                <tr key={order._id} className="hover:bg-gray-50/50">
                  {/* ID & Date */}
                  <td className="px-4 py-4 align-top">
                    <p className="font-mono font-bold text-gray-900">{order.userId?.name || "N/A"}</p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </td>

                  {/* Customer Info */}
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-gray-900">{order.user?.name || addr.fullName || "Guest"}</p>
                    <p className="text-gray-500">{order.userId?.email || addr.email || "No email"}</p>
                    <p className="text-gray-500">{addr.phone || "No phone"}</p>
                  </td>

                  {/* Delivery Address */}
                  <td className="px-4 py-4 align-top max-w-xs">
                    <div className="rounded-md bg-gray-50 p-2 text-gray-800 leading-relaxed border border-gray-200">
                      <p className="font-semibold">{addr.street || addr.address}</p>
                      <p>
                        {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postalCode || addr.zipCode}
                      </p>
                      <p className="font-medium text-gray-600">{addr.country}</p>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-4 align-top">
                    <ul className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="font-semibold text-gray-900">{item.quantity}x</span>{" "}
                          {item.productId?.name || item.name || "Item"}
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Total & Payment */}
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                    <span
                      className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.isPaid || order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus || (order.isPaid ? "Paid" : "Pending")}
                    </span>
                  </td>

                  {/* Status & Actions */}
                  <td className="px-4 py-4 align-top space-y-2">
                    <select
                      value={order.orderStatus || (order.isDelivered ? "Delivered" : "Processing")}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-800 focus:border-black focus:outline-none"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <p className="text-[11px] text-gray-500">
                      Delivery:{" "}
                      <span className={order.isDelivered ? "font-bold text-green-600" : "font-bold text-orange-600"}>
                        {order.isDelivered ? "Delivered" : "In Transit"}
                      </span>
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}