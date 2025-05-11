"use client"
import Display from "./components/ui/display";
import { useEffect, useState } from "react";

export default function Home() {
  const [etherumAvailable, setEtherumAvailable] = useState(false);

  const checkEthereum = () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setEtherumAvailable(true);
    } else {
      setEtherumAvailable(false);
    }
  };
  useEffect(() => {
    checkEthereum();
  }, []);
  if (etherumAvailable) {
    return <Display />;
  }
  return <div>... Loading</div>;
}
