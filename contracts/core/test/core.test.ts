// import { expect } from "chai";
// import { ethers } from "ethers";
// import hre from "hardhat";

// const { viem } = hre;

// describe("CoreToken + CoreFaucet", () => {
//   let owner: any, treasury: any, user1: any, user2: any;
//   let token: any, faucet: any;

//   const INITIAL_SUPPLY = ethers.parseEther("1000000");
//   const CLAIM_AMOUNT   = ethers.parseEther("20");
//   const COOLDOWN       = 60;
//   const FEE_BPS        = 50;

//   beforeEach(async () => {
//     [owner, treasury, user1, user2] = await viem.getSigners();

//     token = await viem.deployContract("CoreToken", [
//       "Alph4 Core",
//       "CØRE",
//       INITIAL_SUPPLY,
//       treasury.address,
//       FEE_BPS,
//       false
//     ]);

//     faucet = await viem.deployContract("CoreFaucet", [
//       token.address,
//       CLAIM_AMOUNT,
//       COOLDOWN
//     ]);

//     await token.write.transfer([faucet.address, ethers.parseEther("1000")]);
//   });

//   it("mints and burns correctly", async () => {
//     await token.write.mint([user1.address, ethers.parseEther("100")]);
//     expect(await token.read.balanceOf([user1.address]))
//       .to.equal(ethers.parseEther("100"));

//     await token.write.burn([user1.address, ethers.parseEther("50")]);
//     expect(await token.read.balanceOf([user1.address]))
//       .to.equal(ethers.parseEther("50"));
//   });

//   it("charges transfer fees between non-exempt users", async () => {
//     const amount = ethers.parseEther("100");
//     await token.write.transfer([user1.address, amount]);

//     const beforeTreasury = await token.read.balanceOf([treasury.address]);
//     await token.connect(user1).write.transfer([user2.address, amount]);
//     const afterTreasury = await token.read.balanceOf([treasury.address]);

//     const expectedFee = (amount * BigInt(FEE_BPS)) / 10_000n;
//     expect(afterTreasury - beforeTreasury).to.equal(expectedFee);
//     expect(await token.read.balanceOf([user2.address]))
//       .to.equal(amount - expectedFee);
//   });

//   it("enforces faucet cooldown", async () => {
//     await faucet.connect(user1).write.claim();
//     const fee = (CLAIM_AMOUNT * BigInt(FEE_BPS)) / 10_000n;
//     expect(await token.read.balanceOf([user1.address]))
//       .to.equal(CLAIM_AMOUNT - fee);

//     await expect(faucet.connect(user1).write.claim())
//       .to.be.revertedWith("cooldown");

//     await hre.network.provider.send("evm_increaseTime", [COOLDOWN + 1]);
//     await hre.network.provider.send("evm_mine");

//     await faucet.connect(user1).write.claim();
//     expect(await token.read.balanceOf([user1.address]))
//       .to.equal((CLAIM_AMOUNT - fee) * 2n);
//   });
// });
