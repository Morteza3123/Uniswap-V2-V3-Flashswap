import { ethers } from "hardhat";

const toWei = (i : string) => ethers.utils.parseEther(i)
const toEther = (i : any) => ethers.utils.formatEther(i)

async function main() {

  let daiAddress: string = '0x6b175474e89094c44da98b954eedeac495271d0f'
  let wethAddress : string = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  let uniAddress : string = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'

  const [owner] = await ethers.getSigners()
  

  const Uniswapv2 = await ethers.getContractFactory("Uniswapv2");
  const uniswapv2 = await Uniswapv2.deploy();
  
  await uniswapv2.deployed();

  await uniswapv2.quickswap(daiAddress, [wethAddress, daiAddress], {value: toWei('1')})
  /*
  let balance = await ethers.provider.getBalance('0x04754B893895ACdA31B486C1c54e06FdE7738AcA')
  console.log('accountBalance1:', ethers.utils.formatUnits(balance))
  await owner.sendTransaction({
    to: "0x04754B893895ACdA31B486C1c54e06FdE7738AcA",
    value: ethers.utils.parseEther("1.0")
});
  balance = await ethers.provider.getBalance('0x04754B893895ACdA31B486C1c54e06FdE7738AcA');
  console.log('accountBalance2:', ethers.utils.formatUnits(balance))
  */
  console.log(`uniswap v2 deployed to ${uniswapv2.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
