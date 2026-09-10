import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    // Confirm payment directly with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment successful — trigger MongoDB order save callback
      await onPaymentSuccess(paymentIntent.id);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 border rounded-xl bg-white shadow-sm">
      <h2 className="text-lg font-bold mb-2">Payment Details</h2>
      
      <PaymentElement />

      {errorMessage && (
        <div className="text-red-500 text-xs font-medium mt-2 bg-red-50 p-2 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full py-3 bg-black text-white font-semibold text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
      >
        {isProcessing ? "Processing Payment..." : "Pay Now"}
      </button>
    </form>
  );
}