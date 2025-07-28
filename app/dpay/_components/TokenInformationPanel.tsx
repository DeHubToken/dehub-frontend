import { FaBolt, FaCoins, FaShieldAlt } from "react-icons/fa";

type Props = {};

const data = [
  {
    name: "DeHub Token",
    description:
      "Tokens are used for subscribing to creators, tipping streamers or unlocking content. The more you hold, the lower your fees are and the more superpowers you unlock like timeline trend boosts and verification badges.",
    icon: <FaCoins className="mt-1 shrink-0" />
  },
  {
    name: "Instant Payments",
    description:
      "Using stripe, you can buy tokens instantly and seamlessly into whatever account you're logged into. DeHub makes tokens simple and for all. If you need more support, just pop up in our 24/7 live community chat and ask for admin support.",
    icon: <FaBolt className="mt-1 shrink-0" />
  },
  {
    name: "Secure Gateway",
    description:
      "All payment details are encrypted and processed securely by Stripe, we can't access or store your sensitive information or card details giving you ultimate peace of mind.",
    icon: <FaShieldAlt className="mt-1 shrink-0" />
  }
];

const TokenInformationPanel = (props: Props) => {
  return (
    <div className="w-full space-y-5 rounded-2xl bg-theme-neutrals-900 p-4 sm:p-12">
      <div className="w-full pb-4 text-center">
        <h2 className="text-3xl font-semibold">About DeHub & payments</h2>
        <p className="text-sm">Your gateway to seamless token payments</p>
      </div>
      {data.map((item) => {
        return (
          <div className="flex w-full items-start gap-3" key={item.name}>
            {item.icon}
            <p className="text-sm">
              <span className="font-medium">{item.name}</span> <br />
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TokenInformationPanel;
