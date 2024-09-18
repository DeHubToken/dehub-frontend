import { useEffect, useState } from "react";

export function useOptOutSSR() {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  return isSSR;
}
