import React from "react";
import { FaCoins, FaBolt, FaShieldAlt } from "react-icons/fa";

type Props = {};

const TokenInformationPanel = (props: Props) => {
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-6 hover:bg-gray-50 hover:bg-opacity-10 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">About DeHub & payments</h2>
          <p className="text-sm">Your gateway to seamless token payments</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <FaCoins className="mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">DeHub Token</h4>
              <p>
              Tokens are used for subscribing to creators, tipping streamers or unlocking content. The more you hold, the lower your fees are and the more superpowers you unlock like timeline trend boosts and verification badges.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaBolt className="mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Instant Payments</h4>
              <p>
              Using stripe, you can buy tokens instantly and seamlessly into whatever account you're logged into. DeHub makes tokens simple and for all. If you need more support, just pop up in our 24/7 live community chat and ask for admin support.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaShieldAlt className="mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Secure Gateway</h4>
              <p>
              All payment details are encrypted and processed securely by Stripe, we can't access or store your sensitive information or card details giving you ultimate peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInformationPanel;
