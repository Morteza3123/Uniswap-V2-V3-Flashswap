import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('hardhat-ethernal');
require('dotenv').config()

module.exports = {
  solidity: "0.8.9",
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

// module.exports = {
//   ethernal: {
//       email: process.env.ETHERNAL_EMAIL,
//       password: process.env.ETHERNAL_PASSWORD,
//   }
// };

// export default config;
