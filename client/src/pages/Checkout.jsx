import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@chakra-ui/react";
import axios from "../axios";

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const [submitting, setSubmitting] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);

  async function createPaymentIntent() {
    setSubmitting(true);
    const response = await axios.post("/orders", {
      orderItems: [
        { productId: "ee6f1db2-c615-4cd5-b09a-c5b471524c29", quantity: 3 },
      ],
    });
    setSubmitting(false);
    setPaymentIntent(response.data);
  }

  async function makePayment(event) {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    await stripe.confirmCardPayment(paymentIntent.client_secret, {
      payment_method: {
        card: cardElement,
      },
    });
  }

  return (
    <div>
      <Button
        marginBottom="8"
        isLoading={submitting}
        type="submit"
        colorScheme="blue"
        onClick={createPaymentIntent}
      >
        Create payment Intent
      </Button>
      <form onSubmit={makePayment}>
        <CardElement />
        <Button
          marginTop="8"
          isLoading={submitting}
          type="submit"
          colorScheme="blue"
        >
          Pay
        </Button>
      </form>
    </div>
  );
}

export default Checkout;
