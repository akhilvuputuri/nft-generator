"use client";
import WalletBalance from "./walletBalance";
import { use, useEffect, useState } from "react";

import { ethers, Contract, Signer } from "ethers";
import MyToken from "../../../artifacts/contracts/MyNFT.sol/MyToken.json";

function Display() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (window.ethereum) {
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


  useEffect(() => {
    updateCount();
  },[contract])


  const updateCount = async () => {
    const count = contract ? await contract.count() : 0;
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  if (!contract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <WalletBalance />

      <h1>Fired Guys NFT Collection</h1>
      <div className="container">
        <div className="row">
          {Array(totalMinted)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} contract={contract} count={totalMinted}/>
              </div>
            ))}
          <div>
            <MintButton updateCount={updateCount} contract={contract} signer={signer}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function MintButton({ updateCount, contract, signer }) {
  const generateImageAndGetCID = async () => {
    const response = await fetch("/api/generate/image");
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
    <button className="btn btn-primary" onClick={mintToken}>
      Mint
    </button>
  );
}

function NFTImage({ tokenId, contract, count }) {
  const [URI, setURI] = useState<String | undefined>(undefined);

  useEffect(() => {
    updateURI();
  }, [count]);

  const updateURI = async () => {
    const uri = await contract.tokenURI(tokenId);
    setURI(uri);
  };
    return (
      <div className="card" style={{ width: "18rem" }}>
        <img
          className="card-img-top"
          src={URI ? `https://magenta-rational-coyote-800.mypinata.cloud/ipfs/${URI.replace("ipfs://", "")}` : "img/placeholder.png"}
        ></img>
        <div className="card-body">
          <h5 className="card-title">ID #{tokenId}</h5>
        </div>
      </div>
    );
  };


export default Display;
