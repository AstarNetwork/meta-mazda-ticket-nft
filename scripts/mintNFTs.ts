// npx hardhat run scripts/mintNFTs.ts --network zKyoto
// npx hardhat run scripts/mintNFTs.ts --network astarZkEvm

import { ethers, network } from 'hardhat';
import fs from 'fs';
import csv from 'csv-parser';
import { expect } from 'chai';

// const MAZDA_CONTRACT = "0xaCF6F481690dE95e333C706e3C96ef940Bc2034C"; //zKyoto
const MAZDA_CONTRACT = ; //astarZkEvm

const contractABI = [
  "function mint(address to, uint256 tokenId) public",
  "function totalSupply() public view returns (uint256)",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
];

const MINTER_ROLE = ethers.id("MINTER_ROLE");

// Helper function to read all addresses from the CSV file into an array
async function readAddressesFromCsv() {
  return new Promise<string[]>((resolve, reject) => {
    const addresses: string[] = [];

    fs.createReadStream('scripts/users.csv')
      .pipe(csv())
      .on('data', (row) => {
        addresses.push(row['address']);
      })
      .on('end', () => resolve(addresses))
      .on('error', reject);
  });
}

// Function to mint NFTs to all addresses
async function mintNFTs() {
  const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY env variable is not set');

  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const signer = wallet.connect(ethers.provider);
  const signerAddress = await signer.getAddress();
  const contract = new ethers.Contract(MAZDA_CONTRACT, contractABI, signer);
  expect(await contract.hasRole(MINTER_ROLE, signerAddress)).to.be.true;

  console.log(`Minting NFTs using \naccount: ${signerAddress} \nnetwork: ${network.name} \ncontract: ${MAZDA_CONTRACT} `)
  var now = new Date();
  console.log(`minting started at: ${now.toISOString()}\n---`);

  const addresses: string[] = await readAddressesFromCsv();
  let cnt = 1;
  for (const address of addresses) {
    const tx = await contract.mint(address, 1);
    await tx.wait();
    console.log(`(${cnt}) Minted NFT to ${address}`);
    cnt++;
  }
  now = new Date();
  console.log(`---\nminting ended at: ${now.toISOString()}`);
  const supply = await contract.totalSupply();
  console.log("total supply", supply);
}

async function main() {
  try {
    await mintNFTs();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export { mintNFTs };