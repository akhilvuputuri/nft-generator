"use client";
import WalletBalance from "./walletBalance";
import { use, useEffect, useState } from "react";
import NFT from "./NFT";
import WordSelector from "./wordSelector";

import { ethers, Contract, Signer } from "ethers";

type DisplayProps = {
  contract: Contract;
  signer: Signer;
};

const WORDS_REQUIRED = 3;

function Dashboard({ contract, signer }: DisplayProps) {
  const [totalMinted, setTotalMinted] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [letsStart, setLetsStart] = useState(false);

  useEffect(() => {
    updateCount();
  }, [contract]);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("/api/generate/descriptors");
      const data = await response.json();
      setWords(data);
      setWordsLoading(false);
    };
    if (letsStart) {
      fetchWords();
    }
  }, [letsStart]);

  const updateCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const generateImageAndGetCID = async () => {
    const response = await fetch("/api/generate/image", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedWords }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  const mintToken = async () => {
    const { cid: metadataURI } = await generateImageAndGetCID();
    console.log("metadataURI", metadataURI);
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();
    updateCount();
  };

  return (
    <div className="bg-indigo-300">
      <WalletBalance />
      {letsStart ? (
        <div className="flex flex-col justify-center items-center p-4 ml-12 mr-12 mt-12 bg-indigo-950 rounded-md shadow-md">
          {wordsLoading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500"></div>
          ) : (
            <WordSelector
              words={words}
              selectedWords={selectedWords}
              setSelectedWords={setSelectedWords}
            />
          )}

          <button
            className={`mt-4 px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              selectedWords.length === WORDS_REQUIRED
                ? "bg-indigo-700 text-white hover:bg-indigo-800"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            onClick={mintToken}
            disabled={selectedWords.length !== WORDS_REQUIRED}
          >
            Click Me
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center p-4 ml-24 mr-24 mt-12 bg-indigo-950 rounded-md shadow-md">
          <button
            className="mt-4 px-4 py-2 bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setLetsStart(true)}
          >
            Let's Start
          </button>
        </div>
      )}

      <div className="flex flex-col justify-center items-center p-4 m-12 bg-indigo-950 rounded-md shadow-md">
        <h1 className="mb-4 text-xl font-bold text-white">
          Your NFT Collection
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(totalMinted)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFT tokenId={i} contract={contract} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
