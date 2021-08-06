const hre = require("hardhat")
const path = require("path");
const fs = require("fs");

async function main() {
  const HollandToken = await hre.ethers.getContractFactory("HollandToken")
  const hollandToken = await HollandToken.deploy()

  await hollandToken.deployed();

  console.log("HollandToken deployed to:", hollandToken.address)

  // write abi to public dir
  const filePath = path.join(__dirname, "../public/hollandTokenAbi.json");
  fs.writeFileSync(filePath, JSON.stringify(hollandToken));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
