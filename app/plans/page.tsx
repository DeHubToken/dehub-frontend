import React from "react";

import Form from "./components/form";
import Tiers from "./components/tiers";

const page = () => {
  return (
    <div>
      <div className="min-h-screen w-full px-2 py-32 sm:px-6">
        <Form />
      </div>
      <div className="min-h-screen w-full px-2 py-32 sm:px-6">
        <div className="flex h-auto w-full flex-col items-start justify-start gap-12 rounded-3xl border border-gray-200/25 px-4 pb-10 pt-10 sm:p-10">
          <div className="flex h-auto w-full flex-wrap items-center justify-center gap-6 text-center md:flex-nowrap md:justify-between md:gap-0 md:text-left">
            <div className="h-auto w-full space-y-2">
              <h1 className="text-4xl sm:text-5xl">My Subscription tier's </h1>
              <p className="text-lg">Hare is the list of your tier's</p>
            </div>
          </div>
          <div className=" items-center justify-center gap-6 sm:flex-nowrap sm:justify-end">
            <div className="  w-full items-stretch justify-center sm:w-auto">
          
                <Tiers />
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
