import React from "react";
import { FaCoins, FaBolt, FaShieldAlt } from "react-icons/fa";

type Props = {};

const TokenInformationPanel = (props: Props) => {
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-6 hover:bg-gray-50 hover:bg-opacity-10 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">About DeHub & DPay</h2>
          <p className="text-sm">Your gateway to seamless token payments</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <FaCoins className="mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">DeHub Token</h4>
              <p>
                DeHub is a utility token powering decentralized entertainment, offering value across streaming, gaming, and NFT ecosystems.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaBolt className="mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Instant Payments with DPay</h4>
              <p>
                DPay lets users buy DeHub tokens using Stripe with instant checkout and automatic delivery to your connected wallet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaShieldAlt className="mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Secure Gateway</h4>
              <p>
                Powered by Stripe, all payments are encrypted and processed securely. No card details are stored by DPay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInformationPanel;
