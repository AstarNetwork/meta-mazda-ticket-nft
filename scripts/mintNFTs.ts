import { ethers } from 'ethers';
import fs from 'fs';
import csv from 'csv-parser';
import { expect } from 'chai';

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
async function mintNFTs(contractAddress: string) {
  const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY env variable is not set');
  const RPC_URL = process.env.RPC_URL;
  if (!RPC_URL) throw new Error('RPC_URL env variable is not set');

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  expect(await contract.hasRole(MINTER_ROLE, wallet.address)).to.be.true;

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

export { mintNFTs };