const hre = require("hardhat")
const path = require("path");
const fs = require("fs");

async function main() {
  const HollandToken = await hre.ethers.getContractFactory("HollandToken")
  const hollandToken = await HollandToken.deploy()

  await hollandToken.deployed();

  console.log("HollandToken deployed to:", hollandToken.address)

  // get contract from artifacts
  // const artifactsHOLPath = path.join(__dirname, '../artifacts/contracts/HollandToken.sol/HollandToken.json')
  // const compiledContract = JSON.parse(fs.readFileSync(artifactsHOLPath))

  // copy contract/contract address to public directory
  // const publicHOLPath = path.join(__dirname, "../public/HollandToken.json")
  // const publicHOLAddressPath = path.join(__dirname, "../public/HollandTokenAddress.json")
  // fs.writeFileSync(publicHOLPath, JSON.stringify(compiledContract));
  // fs.writeFileSync(publicHOLAddressPath, JSON.stringify({ "address": hollandToken.address }))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
