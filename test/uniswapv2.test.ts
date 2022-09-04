import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const toWei = (i: string) => ethers.utils.parseEther(i);
const toEther = (i: any) => ethers.utils.formatEther(i);

describe("uniswapv2", function () {
  let daiAddress: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let wethAddress: string = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  let uniAddress: string = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Uniswapv2 = await ethers.getContractFactory("Uniswapv2");
    const uniswapv2 = await Uniswapv2.deploy();

    return { uniswapv2, owner, otherAccount };
  }

  describe("GetAmountsOut", function () {
    it("Should set the right unlockTime", async function () {
      const { uniswapv2, owner, otherAccount } = await loadFixture(
        deployOneYearLockFixture
      );
      const amountsOut = await uniswapv2.getAmountOutMin(
        wethAddress,
        daiAddress,
        toWei("1")
      );
      console.log(toEther(amountsOut));
      const ownerBalance = await ethers.provider.getBalance(owner.address);
      console.log(toEther(ownerBalance));
      // const transaction = await uniswapv2.connect(owner).quickswap(
      //   [wethAddress, daiAddress],
      //   { gasLimit: 1000000, value:'1000' }
      // );
      const amountIn = 10n ** 18n;
      const weth = await ethers.getContractAt("IWETH", wethAddress)
      const dai = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", daiAddress)  
      await weth.connect(owner).deposit({value : amountIn});
      await weth.connect(owner).approve(uniswapv2.address, amountIn);
      await uniswapv2.swap(wethAddress, daiAddress, toWei('1'), toWei('0'), owner.address);
      console.log("dai balance", toEther(await dai.balanceOf(owner.address)));
    });
  });
});
