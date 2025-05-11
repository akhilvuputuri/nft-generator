import { useEffect, useState } from "react";
import { Contract } from "ethers";

const IMG_WIDTH = 200;
const IMG_HEIGHT = 200;

type NFTProps = {
  tokenId: number;
  contract: Contract;
};

export default function NFT({ tokenId, contract }: NFTProps) {
  const [URI, setURI] = useState<string | undefined>(undefined);

  useEffect(() => {
    updateURI();
  }, []);

  const updateURI = async () => {
    const uri = await contract.tokenURI(tokenId);
    setURI(uri);
  };

return (
  <div className="flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden w-64 border border-gray-300">
    <img
      className="w-full h-64 object-cover"
      src={
        URI
          ? `https://magenta-rational-coyote-800.mypinata.cloud/ipfs/${URI.replace(
              "ipfs://",
              ""
            )}?img-width=${IMG_WIDTH}&img-height=${IMG_HEIGHT}`
          : "img/placeholder.png"
      }
      alt={`NFT ${tokenId}`}
    />
    <div className="p-4 bg-indigo-100 w-full">
      <h5 className="text-lg font-bold text-gray-800 text-center">ID #{tokenId}</h5>
    </div>
  </div>
);
}