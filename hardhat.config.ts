import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ignition-ethers";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";
import * as dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.VITE_RPC_URL!,
      accounts: [process.env.VITE_PRIVATE_KEY!],
    },
  },
};

export default config;
