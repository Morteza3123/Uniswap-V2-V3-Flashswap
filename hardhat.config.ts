import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// require('hardhat-ethernal');
require('dotenv').config()

module.exports = {
  // solidity: "0.8.9",
  solidity: {
    compilers : [
      {
        version: '0.8.9',
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: '0.7.6'
      },
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/ZLEN1lDZkjLOggtOsp8PC2JmoOHVbror',
        blockNumber: 15436690
      }
    },
  },
//   mocha: {
//     timeout: 2000,
// },
};


