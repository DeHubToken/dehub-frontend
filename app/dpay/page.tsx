import React from "react";

import BackToLinks from "./_components/BackToLinks";
import DataTableTnxListTop from "./_components/DataTableTnxListTop";
import OrderForm from "./_components/OrderForm";
import SupplyMonitor from "./_components/SupplyMonitor";
import TokenInformationPanel from "./_components/TokenInformationPanel";
import TransferSummary from "./_components/TransferSummary";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="space-y-20 py-10 sm:mx-6 sm:py-0">
      <div className="grid w-full grid-cols-1 grid-cols-1 gap-8 px-6 sm:px-10 xl:grid-cols-3 xl:gap-0 2xl:px-28 3xl:gap-20">
        <div className="w-full space-y-10 sm:space-y-20">
          <TransferSummary />
          <SupplyMonitor />
        </div>
        <OrderForm />
        <TokenInformationPanel />
      </div>

      <div className="w-full space-y-8 border-t border-neutral-800 py-10">
        <div className="flex w-full flex-wrap items-center justify-between gap-4 px-6 sm:px-0">
          <h1 className="text-3xl font-semibold">Latest Transactions</h1>
          <BackToLinks
            links={[
              { href: "/", label: "Back to Home" },
              { href: "/me", label: "Profile" },
              { href: "/dpay/tnx", label: "Show All" }
            ]}
          />
        </div>
        <DataTableTnxListTop />
      </div>
    </div>
  );
};

export default Page;
