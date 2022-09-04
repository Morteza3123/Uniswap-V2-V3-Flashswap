import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import axios from "axios";

const toWei = (i : string) => ethers.utils.parseEther(i)
const toEther = (i : any) => ethers.utils.formatEther(i)

describe("uniswapv2", function () {

    //mainnet addresses
    let daiAddress: string = '0x6b175474e89094c44da98b954eedeac495271d0f'
    let wethAddress : string = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    let uniAddress : string = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
    let routerAddress : string = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
    
    //amout for trade
    let amountsIn = toWei('1')
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    //get contract's abi from etherscan
    const routerAbi = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${routerAddress}&apikey=${process.env.ETHERSCAN_KEY}`);
    const daiAbi = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${daiAddress}&apikey=${process.env.ETHERSCAN_KEY}`);

    //create contract using contract address and abi
    const routerContract = new ethers.Contract(routerAddress, routerAbi.data.result, ethers.provider);
    const daiContract = new ethers.Contract(daiAddress, daiAbi.data.result, ethers.provider);
    
    //get signers
    const [owner, otherAccount] = await ethers.getSigners();

    

    return {owner, otherAccount, routerAbi, routerContract, daiContract };
  }

  describe("Swap", function () {
    it("swap eth to dai", async function () {
        
      const {owner, otherAccount, routerAbi, routerContract, daiContract } = await loadFixture(deployOneYearLockFixture);
      
      //get amounts out
      const amounts = await routerContract.getAmountsOut(amountsIn, [wethAddress, daiAddress]); 
      const amountsOut = amounts[1];
      console.log("amountsOut", toEther(amountsOut));
      
      //swap
      console.log("owner dai balance befor swap",toEther(await daiContract.balanceOf(owner.address)))
      await routerContract.connect(owner).swapExactETHForTokens(amountsOut, [wethAddress, daiAddress], owner.address, Date.now(), {gasLimit: 1000000, value: amountsIn});
      console.log("owner dai balance after swap",toEther(await daiContract.balanceOf(owner.address)));

      //transfer dai token to another account
      await daiContract.connect(owner).transfer(otherAccount.address, toWei('10'));
      console.log('owner dai balance after transfer', toEther(await daiContract.balanceOf(owner.address)))
      console.log('other account dai balance after transfer', toEther(await daiContract.balanceOf(otherAccount.address)))
        console.log('success')
    });
    
  });

    
  });

