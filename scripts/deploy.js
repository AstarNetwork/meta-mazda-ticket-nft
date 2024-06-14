//npx hardhat run scripts/deploy.js --network hardhat

require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
  const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider);

  console.log(
    "Deploying contracts with the account:",
    wallet.address
  );

  console.log("Account balance:", (await hre.ethers.provider.getBalance(wallet.address)).toString());

  const ContractFactory = await hre.ethers.getContractFactory("MetaMazdaTicket", wallet);
  const contract = await ContractFactory.deploy("Meta-Mazda Ticket", "MMT");

  await contract.waitForDeployment();

  console.log("MetaMazdaTicket contract deployed to:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });