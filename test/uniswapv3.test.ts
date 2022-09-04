import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const WETH9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const UNI = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const QOUTE = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

const toWei = (i : string) => ethers.utils.parseEther(i)
const toEther = (i : any) => ethers.utils.formatEther(i)

describe("Uniswap v3 test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    //get dai and weth contracts
    const weth = await ethers.getContractAt("IWETH", WETH9)
    const dai = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", DAI)
    const qouterContract = await ethers.getContractAt("IQuoter", QOUTE);
    //deploy swap contract
    const SwapExamples = await ethers.getContractFactory("SwapExamples");
    const swapExamples = await SwapExamples.deploy();
    await swapExamples.deployed();


    return { swapExamples, owner, otherAccount, weth, dai, qouterContract };
  }

  describe("Swap in uniswapv3", function () {
    it("show amount out", async function () {
      const { swapExamples, owner, otherAccount, weth, dai, qouterContract } = await loadFixture(deployOneYearLockFixture);
      const amountIn = 10n ** 18n;  
      

      
      const amountOut =await qouterContract.callStatic.quoteExactInputSingle(
        WETH9,
        DAI,
        '3000',
        amountIn,
        0
      );
      console.log("amountOut", toEther(amountOut));
    });


    it("swapExactInputSingle", async function () {
      const { swapExamples, owner, otherAccount, weth, dai } = await loadFixture(deployOneYearLockFixture);
      const amountIn = 10n ** 18n;  
      await weth.connect(owner).deposit({value : amountIn});
      await weth.connect(owner).approve(swapExamples.address, amountIn);

      await swapExamples.swapExactInputSingle(amountIn, DAI);

      console.log("DAI balance", toEther(await dai.balanceOf(owner.address)));
    });

    
    it("swapExactInputMultihop", async function () {
      const { swapExamples, owner, otherAccount, weth, dai } = await loadFixture(deployOneYearLockFixture);
      const amountIn = 10n ** 18n;  
      await weth.connect(owner).deposit({value : amountIn});
      await weth.connect(owner).approve(swapExamples.address, amountIn);

      await swapExamples.swapExactInputMultihop(amountIn, DAI);

      console.log("DAI balance", toEther(await dai.balanceOf(owner.address)));
    });

    it("swapExactOutputSingle", async function () {
      const { swapExamples, owner, otherAccount, weth, dai } = await loadFixture(deployOneYearLockFixture);
      const wethAmountInMax = 10n ** 18n; 
      const daiAmountOut = 100n * 10n **18n; 
      await weth.connect(owner).deposit({value : wethAmountInMax});
      await weth.connect(owner).approve(swapExamples.address, wethAmountInMax);

      await swapExamples.swapExactOutputSingle(daiAmountOut, wethAmountInMax, DAI);
      console.log("DAI balance", toEther(await dai.balanceOf(owner.address)));
    });
    
  });
});
