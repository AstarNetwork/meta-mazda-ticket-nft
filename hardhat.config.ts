import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-ignition"
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });
const TESTNET_PRIVATE_KEY = process.env.ZKYOTO_PRIVATE_KEY || "";
const MAINNET_PRIVATE_KEY = process.env.ASTARZKEVM_PRIVATE_KEY || "";
console.log("TESTNET_PRIVATE_KEY set:", !!TESTNET_PRIVATE_KEY);
console.log("MAINNET_PRIVATE_KEY set:", !!MAINNET_PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.startale.com/astar-zkevm`,
        // blockNumber: process.env.FORK_BLOCK_NUMBER === "true" ? 13546500 : undefined
      },
    },
    zKyoto: {
      url: `https://rpc.startale.com/zkyoto`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    shibuya: {
      url: `https://evm.shibuya.astar.network`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    astarZkEvm: {
      url: `https://rpc.startale.com/astar-zkevm`,
      accounts: [MAINNET_PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: {
      zKyoto: " ",
      astarZkEvm: " "
    },
    customChains: [
      {
        network: "zKyoto",
        chainId: 6038361,
        urls: {
          apiURL: "https://astar-zkyoto.blockscout.com/api",
          browserURL: "https://astar-zkyoto.blockscout.com/",
        },
      },
      {
        network: "astarZkEvm",
        chainId: 3776,
        urls: {
          apiURL: "https://astar-zkevm.explorer.startale.com/api",
          browserURL: "https://astar-zkevm.explorer.startale.com/",
        },
      },

    ],
  },
};

export default config;