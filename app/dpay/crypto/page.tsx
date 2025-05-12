"use client"
import React, { useState, useEffect } from "react";
import { loadStripeOnramp } from "@stripe/crypto";

import { CryptoElements, OnrampElement }  from "./components/StripeCryptoElements"
import { api } from "@/libs/api";
import { env } from "@/configs";

// Make sure to call loadStripeOnramp outside of a component’s render to avoid
// recreating the StripeOnramp object on every render.
// This is your test publishable API key.
const stripeOnrampPromise = loadStripeOnramp(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CryptoPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetches an onramp session and captures the client secret
    api(
      "/dpay/create-onramp-session",
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_details: {
          destination_currency: "usdc",
          destination_exchange_amount: "13.37",
          destination_network: "ethereum",
        }
      }),
    }) 
      .then((data:any) => setClientSecret(data.clientSecret));
  }, []);

  const onChange = React.useCallback(({ session }:any) => {
    setMessage(`OnrampSession is now in ${session.status} state.`);
  }, []);

  return (
    <div className="App">
      <CryptoElements stripeOnramp={stripeOnrampPromise}>
        {clientSecret && (
          <OnrampElement
            id="onramp-element"
            clientSecret={clientSecret}
            appearance={{ theme: "dark" }}
            onChange={onChange}
            onReady={()=>{}}
          />
        )}
      </CryptoElements>
      {message && <div id="onramp-message">{message}</div>}
    </div>
  );
}