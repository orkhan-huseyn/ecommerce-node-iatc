import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { RouterProvider } from "react-router-dom";
import router from "./router";

const stripePromise = loadStripe(
  "pk_test_51O04EeAwSkQoEybJOoQLHhZL4WdzG0qS0m5vnmyQXTBlr7gVx5ZNBYrf4dTHwDcDt5xLMncwqliAocBRt9xVZ3fP00eBVnF4jn"
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Elements>
  </React.StrictMode>
);
