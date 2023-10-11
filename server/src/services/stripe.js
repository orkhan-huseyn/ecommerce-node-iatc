const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(line_items) {
  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:5173/payment-success",
    cancel_url: "http://localhost:5173/payment-fail",
    line_items,
    mode: "payment",
  });
  return session;
}

async function createPaymentIntent(orderId, amount) {
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: {
      orderId,
    },
  });
  return intent;
}

module.exports = {
  createCheckoutSession,
  createPaymentIntent,
};
