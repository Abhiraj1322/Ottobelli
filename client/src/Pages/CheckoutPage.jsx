import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import CheckoutForm from "../components/layout/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from Cart via navigate("/checkout", { state: { ... } })
  const checkoutData = location.state;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Validate state exists; redirect if accessed directly or refreshed
  useEffect(() => {
    if (!checkoutData || !checkoutData.totalPrice || checkoutData.totalPrice <= 0) {
      // Redirect back to cart if no state data is present
      navigate("/cart", { replace: true });
      return;
    }

    // 2. Fetch Stripe PaymentIntent using total price from location state
    const fetchPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.post(
          "/api/payment/create-payment-intent",
          { amount: checkoutData.totalPrice, currency: "cad" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Failed to initialize payment:", err);
        setError("Unable to initialize payment session. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [checkoutData, navigate]);

  // 3. Callback executed when Stripe payment succeeds
  const handlePaymentSuccess = async (stripePaymentIntentId) => {
    try {
      const token = localStorage.getItem("token");

      // Save order record to MongoDB
      const orderPayload = {
        items: checkoutData.cartItems,
        shippingAddress: checkoutData.shippingAddress || {
          line1: "123 Main St",
          city: "Vaughan",
          province: "ON",
          postalCode: "L4K 1A1",
          country: "Canada",
        },
        subtotal: checkoutData.subtotal,
        shippingCost: checkoutData.shippingCost,
        tax: checkoutData.tax,
        total: checkoutData.totalPrice,
        stripePaymentIntentId,
        paymentStatus: "paid",
        orderStatus: "processing",
      };

      const res = await api.post("/api/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Clear local storage cart if used
        localStorage.removeItem("cart");
        navigate(`/order-confirmation/${res.data.order._id}`);
      }
    } catch (err) {
      console.error("Failed to save order record:", err);
      alert("Payment was successful, but saving order failed. Please contact support.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
        Initializing Secure Payment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-semibold mb-4 text-sm">{error}</p>
        <button
          onClick={() => navigate("/cart")}
          className="px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase border border-black hover:bg-black hover:text-white transition-all"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Order Summary */}
        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1814]">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {checkoutData.cartItems?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-stone-200 pb-2">
                <div>
                  <p className="font-semibold text-stone-800">{item.name || "Custom Piece"}</p>
                  <p className="text-stone-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-stone-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-stone-300 pt-4 text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${checkoutData.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${checkoutData.shippingCost?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (13%):</span>
              <span>${checkoutData.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#1A1814] pt-2 border-t border-stone-300">
              <span>Total:</span>
              <span>${checkoutData.totalPrice?.toFixed(2)} CAD</span>
            </div>
          </div>
        </div>

        {/* Right Column: Stripe Checkout Form */}
        <div>
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
            </Elements>
          )}
        </div>

      </div>
    </div>
  );
}