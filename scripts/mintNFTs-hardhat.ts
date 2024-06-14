// npx hardhat run scripts/mintNFTs.ts --network hardhat
import { ethers, network } from 'hardhat';
import fs from 'fs';
import csv from 'csv-parser';
import { expect } from 'chai';

var MAZDA_CONTRACT = "";

const contractABI = [
  "function mint(address to, uint256 tokenId) public",
  "function totalSupply() public view returns (uint256)",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
];

const MINTER_ROLE = ethers.id("MINTER_ROLE");

async function myDeploy() {
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY || "";
  const wallet = new ethers.Wallet(privateKey, ethers.provider);

  console.log(
    "Deploying contracts with the account:",
    wallet.address
  );

  console.log("Account balance:", (await ethers.provider.getBalance(wallet.address)).toString());

  const ContractFactory = await ethers.getContractFactory("MetaMazdaTicket", wallet);
  const contract = await ContractFactory.deploy("MetaMazdaTicket", "MMT");

  await contract.waitForDeployment();

  console.log("MetaMazdaTicket contract deployed to:", contract.target);
  return contract.target;
}

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
  // const RPC_URL = process.env.RPC_URL;
  // if (!RPC_URL) throw new Error('RPC_URL env variable is not set');

  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const signer = wallet.connect(ethers.provider);
  const contract = new ethers.Contract(MAZDA_CONTRACT, contractABI, signer);
  expect(await contract.hasRole(MINTER_ROLE, signer.getAddress())).to.be.true;

  console.log(`Minting NFTs using \naccount: ${signer.getAddress()} \nnetwork: ${network.name} \ncontract: ${MAZDA_CONTRACT} `)
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
    MAZDA_CONTRACT = await myDeploy() as string; // Cast the return value of myDeploy() to string
    await mintNFTs();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export { mintNFTs };