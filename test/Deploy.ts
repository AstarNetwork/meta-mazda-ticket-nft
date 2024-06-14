import { expect } from "chai";
import { ethers } from "hardhat";
import { mintNFTs } from "../scripts/mintNFTs";
import * as dotenv from 'dotenv';

const NAME = "MetaMazdaTicket";
const SYMBOL = "MAZDA";

describe("Deploy test", function () {
  let mazda: any;

  beforeEach(async () => {
    const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY as string;
    const RPC_URL = process.env.RPC_URL as string;

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const Mazda = await ethers.getContractFactory("MetaMazdaTicket", wallet);
    mazda = await Mazda.deploy(NAME, SYMBOL);
    await mazda.waitForDeployment();
    console.log("contractAddress", mazda.target);

  });

    it('Should mint NFTs to all addresses in users.csv', async function () {
      const result = await mintNFTs(mazda.target);
      const supply = await mazda.totalSupply();
      expect(supply).to.equal(3);
    });
  });