const stripe = require("stripe")
(process.env.STRIPE_SECRET_KEY);


exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "cad" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    // Stripe requires amount in smallest currency unit (e.g., $10.50 CAD -> 1050 cents)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};