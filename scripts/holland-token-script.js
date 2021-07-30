const hre = require("hardhat")

async function main() {
  const HollandToken = await hre.ethers.getContractFactory("HollandToken")
  const hollandToken = await HollandToken.deploy()

  await hollandToken.deployed();

  console.log("HollandToken deployed to:", hollandToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
