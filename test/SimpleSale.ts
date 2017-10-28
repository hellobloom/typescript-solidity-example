import * as chai from "chai";

const chaiBignumber = require("chai-bignumber");

chai.use(chaiBignumber(web3.BigNumber)).should();

const SimpleSale = artifacts.require("SimpleSale");
const SimpleToken = artifacts.require("SimpleToken");

contract("SimpleSale", function([_, buyer, wallet, donor, recipient]) {
  function latestBlockTime() {
    return latestBlock().timestamp;
  }

  function latestBlock() {
    const latestBlock = web3.eth.getBlock("latest");

    if (latestBlock && latestBlock.number && latestBlock.timestamp) {
      return {
        number: latestBlock.number,
        timestamp: latestBlock.timestamp
      };
    } else {
      throw `Expected web3.eth.getBlock to return a block object but got ${latestBlock}`;
    }
  }

  it("allows user to purchase", async () => {
    const sale = await SimpleSale.new(
      latestBlockTime() + 1,
      latestBlockTime() + 10,
      50,
      wallet
    );

    const token = SimpleToken.at(await sale.token());

    const balanceBefore = await token.balanceOf(buyer);
    await sale.sendTransaction({
      value: 50,
      from: buyer
    });
    const balanceAfter = await token.balanceOf(buyer);

    balanceBefore.should.be.bignumber.equal(0);
    balanceAfter.should.be.bignumber.equal(2500);
  });

  it("allows user to buy tokens for another user", async () => {
    const sale = await SimpleSale.new(
      latestBlockTime() + 1,
      latestBlockTime() + 10,
      50,
      wallet
    );

    const token = SimpleToken.at(await sale.token());

    const recipientBalanceBefore = await token.balanceOf(recipient);
    const donorBalanceBefore = await token.balanceOf(donor);

    await sale.buyTokens(recipient, {
      value: 50,
      from: donor
    });

    const recipientBalanceAfter = await token.balanceOf(recipient);
    const donorBalanceAfter = await token.balanceOf(donor);

    recipientBalanceBefore.should.be.bignumber.equal(0);
    recipientBalanceAfter.should.be.bignumber.equal(2500);
    donorBalanceBefore.should.be.bignumber.equal(0);
    donorBalanceAfter.should.be.bignumber.equal(0);
  });
});
