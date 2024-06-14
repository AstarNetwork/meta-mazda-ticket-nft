import { expect } from "chai";
import { ethers } from "hardhat";
import { mintNFTs } from "../scripts/mintNFTs";

const NAME = "MetaMazdaTicket";
const SYMBOL = "MAZDA";
const MAX_SUPPLY = 1111;
const CONTRACT_URI_NEW = 'data:application/json;utf8,{"name": "Yoki collection","description":"Yoki collection Testnet","image": "https://bafybeiciwh2uki577w2fwgxde32ozaeyd3dgd3juhr3xirxqbhfkwrullu.ipfs.nftstorage.link/0.png"}';
const BASE_URI = "ipfs://bafybeid7m6zourukghb3uajd45qo4seuny3rpdyuy6yhjfp6ja3d6pgy2e/"
const ROTATE_METADATA = 1;

describe("Deploy test", function () {
  let mazda: any;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const Mazda = await ethers.getContractFactory("MetaMazdaTicket");
    mazda = await Mazda.deploy(NAME, SYMBOL);
    await mazda.waitForDeployment();
    console.log("contractAddress", mazda.target);

  });

    it('Should mint NFTs to all addresses in users.csv', async function () {
        const [owner] = await ethers.getSigners();
        const result = await mintNFTs(mazda, owner);

        const supply = await mazda.totalSupply();
        console.log("supply", supply);

        // expect(result).to.equal('success');});
    });
  });