// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const ChatApp = await hre.ethers.getContractFactory("ChatApp");
  console.log("Deploying ChatApp...");

  // Deploy the contract
  const chatApp = await ChatApp.deploy();
  await chatApp.waitForDeployment();

  console.log("ChatApp deployed to:", chatApp.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
