import { ethers } from 'ethers';
import fs from 'fs';
import csv from 'csv-parser';

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
async function mintNFTs(contract: any, signer: any) {
  console.log("mintNFTs");

  const addresses: string[] = await readAddressesFromCsv();

  for (const address of addresses) {
    console.log("address: ", address);
    const tx = await contract.connect(signer).mint(address, 1);
    await tx.wait();
    console.log("Transaction hash: ", tx.hash);
    console.log(`Minted NFT to ${address}`);
    const supply = await contract.totalSupply();
    console.log("totalsupply", supply);
  }
}

export { mintNFTs };