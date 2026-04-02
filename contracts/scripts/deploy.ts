import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying OpenMusicFactory with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  const Factory = await ethers.getContractFactory("OpenMusicFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();

  console.log("\n✅ OpenMusicFactory deployed to:", factoryAddress);
  console.log("\nAdd this to your root .env file:");
  console.log(`FACTORY_CONTRACT_ADDRESS=${factoryAddress}`);

  console.log("\nVerify the contract on Basescan:");
  console.log(
    `npx hardhat verify --network baseSepolia ${factoryAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
