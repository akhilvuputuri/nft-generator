"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function WalletBalance() {
  const [balance, setBalance] = useState();

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(3));
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-indigo-950 text-white">
      <h1 className="text-2xl font-bold">NFT Generator</h1>
      <div className="ml-auto text-sm bg-indigo-700 p-2 rounded-md">Wallet Balance: {balance} ETH</div>
    </div>
  );
}

export default WalletBalance;
