"use client";
import Dashboard from "./components/ui/dashboard";
import { useEffect, useState } from "react";
import { ethers, Contract, Signer } from "ethers";
import MyToken from "../artifacts/contracts/MyNFT.sol/MyToken.json";

export default function Home() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (window?.ethereum) {
          const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

          const provider = new ethers.providers.Web3Provider(window.ethereum);

          // get the end user
          const signer = provider.getSigner();
          setSigner(signer);

          // get the smart contract
          const contract = new ethers.Contract(
            contractAddress,
            MyToken.abi,
            signer
          );
          setContract(contract);
          console.log("Connected to Metamask");
        } else {
          console.log("Metamask not found");
        }
      } catch (err) {
        console.error(err);
      }
    };

    connectToMetamask();
  }, []);
  if (contract && signer) {
    return <Dashboard contract={contract} signer={signer}/>;
  }
  return <div>... Loading</div>;
}
