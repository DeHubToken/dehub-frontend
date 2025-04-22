import React from "react";

import OrderPage from "./_components/OrderPage";
import TokenInformationPanel from "./_components/TokenInformationPanel";
import TotalSuccessCard from "./_components/TotalSuccessCard";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex  flex-wrap ">
      <OrderPage />
      <div className="flex flex-col justify-start align-top ">
        <TotalSuccessCard />
        <TokenInformationPanel />
      </div>
    </div>
  );
};

export default page;
