# NFT Generator


NFT Generator that generates artwork with OpenAI GPT image generation using chosen visual descriptors, uploads it to IPFS and mints a new NFT with an ERC-721 smart contract.

Category of the collection is fully customisable by simply modifying NFT_COLLECTION_CATEGORY variable in .env file. We can build do generation for pokemon, cars, cats, dogs etc.

## Features

- Generate visual descriptors for NFTs for users to choose.
- Generate image using chosen visual descriptors
- Upload metadata and images to IPFS via Pinata.
- Mint NFTs on the blockchain.
- View minted NFTs.
- Wallet balance integration with Metamask.

## Technologies Used

- **Frontend**: React, Ethers.js
- **Backend**: Next.js API routes
- **Blockchain**: Hardhat, Smart Contracts
- **Storage**: Pinata (IPFS)
- **AI**: OpenAI API

## Usage

### Deploy smart contract and run local Ethereum network
```bash
cd web3
npm install

# terminal 1
npx hardhat node

# terminal 2
npx hardhat compile
npx hardhat run scripts/sample-script.js --network localhost

```

Update the deployed contract address in `client/src/app/page.tsx`

### Run web application
```bash
# terminal 3
cd client
npm install
npm run dev
```