import React from "react";

import OrderPage from "./_components/OrderPage";
import TokenInformationPanel from "./_components/TokenInformationPanel";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex  flex-wrap justify-center align-middle" >
      <OrderPage />
      <TokenInformationPanel />
    </div>
  );
};

export default page;
