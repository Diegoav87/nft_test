const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FunkBoings", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const FunkBoings = await ethers.getContractFactory("FunkBoings");
    const funkboings = await FunkBoings.deploy();
    await funkboings.deployed();

    const recipient = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199';
    const metadataURI = 'cid/test.png';

    let balance = await funkboings.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await funkboings.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05') });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await funkboings.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await funkboings.isContentOwned(metadataURI)).to.equal(true);
  });
});
