import React from "react";

import TnxPage from "../../_components/TnxPage";

type Props = {
  params: { sid: string };
};

export default async function page(props: Props) {
  const { sid } = props.params;

  return (
    <div>
      <TnxPage sid={sid} />
    </div>
  );
}
 
