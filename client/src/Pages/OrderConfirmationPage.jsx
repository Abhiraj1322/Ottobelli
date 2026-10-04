import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success || res.data.order) {
          setOrder(res.data.order || res.data);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Failed to fetch order confirmation:", err);
        setError(err.response?.data?.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-gray-600">
        <p className="text-sm font-semibold uppercase tracking-wider">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Order Error</h2>
        <p className="text-gray-600 text-sm mb-6">{error || "Unable to display order confirmation."}</p>
        <Link to="/" className="inline-block rounded-md bg-black px-5 py-2.5 text-xs font-semibold uppercase text-white hover:bg-gray-800">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-10">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        {/* Success Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Thank You for Your Order!</h1>
          <p className="mt-1 text-xs text-gray-500">Order ID: <span className="font-mono text-gray-800">{order._id}</span></p>
        </div>

        {/* Status Badge */}
        <div className="mb-6 flex justify-between items-center rounded-lg bg-gray-50 p-4 text-xs font-medium">
          <div>
            <span className="text-gray-500">Payment Status:</span>{" "}
            <span className="font-bold uppercase text-green-700">{order.paymentStatus || "Paid"}</span>
          </div>
          <div>
            <span className="text-gray-500">Order Status:</span>{" "}
            <span className="font-bold uppercase text-blue-700">{order.orderStatus || "Processing"}</span>
          </div>
        </div>

        {/* Item List */}
        <div className="mb-6 border-t border-b border-gray-100 py-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-700">Ordered Items</h2>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-gray-800">{item.productId?.name || item.name || "Item"}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-1 text-xs text-gray-600 text-right mb-8">
          <p>Subtotal: <span className="font-semibold text-gray-800">${order.subtotal?.toFixed(2)}</span></p>
          <p>Shipping: <span className="font-semibold text-gray-800">${order.shippingCost?.toFixed(2)}</span></p>
          <p>Tax: <span className="font-semibold text-gray-800">${order.tax?.toFixed(2)}</span></p>
          <p className="text-base font-bold text-gray-900 mt-2">Total Paid: ${order.total?.toFixed(2)}</p>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link to="/" className="inline-block rounded-md bg-black px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-gray-800">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}