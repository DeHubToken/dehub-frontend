import React from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import { getPlan } from "@/services/subscription-plans";

import Form from "../components/form";

type Props = {
  params: { id: string };
};
const page = async (props: Props) => {
  const { id } = props.params;
  const plan:any = await getPlan(id); 
  if (plan.success == false) {
    redirect(`/plans?err=${plan.error}`);
  }
  return (
    <div>
      <div className="min-h-screen w-full px-2 py-32 sm:px-6">
        <Form plan={plan?.data?.plan} />
      </div> 
    </div>
  );
};

export default page;
