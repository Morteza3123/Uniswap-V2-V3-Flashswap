import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('hardhat-ethernal');
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/ZLEN1lDZkjLOggtOsp8PC2JmoOHVbror',
        blockNumber: 15436690
      }
    },
  },
};

export default config;
