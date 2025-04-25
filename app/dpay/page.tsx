import React from "react";

import BackToLinks from "./_components/<BackToLinks";
import DataTableTnxListTop from "./_components/DataTableTnxListTop";
import OrderPage from "./_components/OrderPage";
import SupplyBox from "./_components/SupplyBox";
import TokenInformationPanel from "./_components/TokenInformationPanel";
import TotalSuccessCard from "./_components/TotalSuccessCard";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="w-full px-4 py-6 xl:px-8">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 lg:grid-cols-3">
        {/* Left Column - Order & Token Info */}

        <div className="flex flex-col gap-4">
          <SupplyBox />
          <div className="w-full">
            <TotalSuccessCard />
          </div>
        </div>

        {/* Middle Column - Supply & Success */}
        <div className="flex flex-col gap-6">
          <OrderPage />
        </div>
        {/* Right Column - Table */}
        <div className="col-span-1">
          <TokenInformationPanel />
        </div>
      </div>

      <div className="w-full px-4 py-6 xl:px-8 ">
        <div className="mb-2  flex items-end justify-end mr-5">
          <BackToLinks
            links={[
              { href: "/", label: "Back to Home" },
              { href: "/me", label: " Profile" },
              { href: "/dpay/tnx", label: " Show All " }
            ]}
          />
        </div>
        <DataTableTnxListTop />
      </div>
    </div>
  );
};

export default Page;
