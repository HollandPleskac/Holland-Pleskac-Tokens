const { expect } = require("chai");

describe("HollandToken", function () {
  it("Should deploy HollandToken", async function () {
    const HollandToken = await ethers.getContractFactory("HollandToken");
    const hollandToken = await HollandToken.deploy();
    await hollandToken.deployed();
  });

  it('Transfer HollandTokens', async function () {
    const decimals = ethers.BigNumber.from(10).pow(18)

    const HollandToken = await ethers.getContractFactory("HollandToken");
    const hollandToken = await HollandToken.deploy();
    await hollandToken.deployed();

    const acc1BalanceOriginal = await hollandToken.balanceOf('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
    console.log('balance acc 1 original: ', ethers.BigNumber.from(acc1BalanceOriginal).div(decimals))

    const transferTx = await hollandToken.transfer('0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', ethers.BigNumber.from(1).mul(decimals))
    await transferTx.wait();  // wait until the transaction is mined

    const acc1BalanceAfter = await hollandToken.balanceOf('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
    console.log('balance acc 1 after: ', ethers.BigNumber.from(acc1BalanceAfter).div(decimals))
    
    expect(acc1BalanceAfter.div(decimals).toNumber()).to.equal(acc1BalanceOriginal.div(decimals).sub(1).toNumber());
  })

  it('Log Transfers', async function () {
    const decimals = ethers.BigNumber.from(10).pow(18)

    const HollandToken = await ethers.getContractFactory("HollandToken");
    const hollandToken = await HollandToken.deploy();
    await hollandToken.deployed();

    const [owner, addr1] = await ethers.getSigners();
    // console.log('addr1',addr1.address)
    const transferTx = await hollandToken.transfer(addr1.address, ethers.BigNumber.from(1).mul(decimals))
    await transferTx.wait();

    const ownerTransfers = await hollandToken.getTransferHistory()
    console.log('owner transfers', ownerTransfers)
    expect(ownerTransfers[1].transferType).to.equal('subtract')

    const addr1Transfers = await hollandToken.connect(addr1).getTransferHistory()
    console.log('addr1 transfers', addr1Transfers)
    expect(addr1Transfers[0].transferType).to.equal('add')

  })
});



// 0 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

// 1 0x70997970c51812dc3a010c7d01b50e0d17dc79c8

    // const setHollandTokenTx = await hollandToken.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setHollandTokenTx.wait();

    // expect(await hollandToken.greet()).to.equal("Hola, mundo!");