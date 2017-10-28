import * as BigNumber from "bignumber.js";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

const chaiBignumber = require("chai-bignumber");

chai.use(chaiBignumber(web3.BigNumber)).should();

const SimpleSale = artifacts.require("SimpleSale");
const SimpleToken = artifacts.require("SimpleToken");

contract("SimpleSale", function([_, buyer, wallet, purchaser]) {
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
});
