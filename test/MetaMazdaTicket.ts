import { expect } from "chai";
import { ethers } from "hardhat";

const NAME = "MetaMazdaTicket";
const SYMBOL = "MAZDA";
const MAX_SUPPLY = 1111;
const CONTRACT_URI_NEW = 'data:application/json;utf8,{"name": "Yoki collection","description":"Yoki collection Testnet","image": "https://bafybeiciwh2uki577w2fwgxde32ozaeyd3dgd3juhr3xirxqbhfkwrullu.ipfs.nftstorage.link/0.png"}';
const BASE_URI = "ipfs://bafybeid7m6zourukghb3uajd45qo4seuny3rpdyuy6yhjfp6ja3d6pgy2e/"
const ROTATE_METADATA = 1;

describe("MetaMazdaTicket contract", function () {
  let mazda: any;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const Mazda = await ethers.getContractFactory("MetaMazdaTicket");
    mazda = await Mazda.deploy(NAME, SYMBOL);

  });

  it("General setup", async function () {
    const [owner] = await ethers.getSigners();
    expect(await mazda.name()).to.equal(NAME);
    expect(await mazda.symbol()).to.equal(SYMBOL);
    await mazda.setContractURI(CONTRACT_URI_NEW);
    expect(await mazda.contractURI()).to.equal(CONTRACT_URI_NEW);
  });

  it("mint works", async function () {
    const [owner, account1] = await ethers.getSigners();

    expect(await mazda.totalSupply()).to.equal(0);
    await mazda.mint(account1.address, 1);
    expect(await mazda.totalSupply()).to.equal(1);
  });

  it("Should return correct tokenURI", async function () {
    const [owner, account1] = await ethers.getSigners();
    await mazda.setBaseURI(BASE_URI);
    const baseURI = await mazda.baseURI();
    expect(baseURI).to.equal(BASE_URI);

    const baseExtension = await mazda.baseExtension();
    expect(baseExtension).to.equal(".json");

    // we need mint to make first 10 token exist
    await mazda.mint(account1.address, 10);

    for(let i = 1; i <= 10; i++) {
      const expectedURI = baseURI;
      const tokenURI = await mazda.tokenURI(i);
      expect(tokenURI).to.equal(expectedURI);
    }
  });


});

