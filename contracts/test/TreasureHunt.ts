import { expect } from "chai";
import { getSignatureFromSigner, getSignerForPassword } from "../lib/helper";
const { ethers, unlock } = require("hardhat");

// These are just password for the tests
// The real ones will be different :D
const passwords = [
  "UnlockTheWeb", // Get it from the Unlock Discord
  "CoinviseRocks", // Get it from te Coinvise discord
  "ThirdWebDevs", // Get it from the ThirdWeb Discord
  "WIFI_PASSWORD", // Get it from the main venue
  "WelcomeToTheClub", // Get it from the Unlock + coinvise party!
];

describe("TreasureHunt", function () {
  it("should work as a hook", async function () {
    const [user] = await ethers.getSigners();

    await unlock.deployProtocol();
    const expirationDuration = 60 * 60 * 24 * 365;
    const maxNumberOfKeys = 100;
    const keyPrice = 0;
    const locks = [];

    // Create all the locks
    for (let i = 0; i < passwords.length; i++) {
      const { lock } = await unlock.createLock({
        expirationDuration,
        maxNumberOfKeys,
        keyPrice,
        name: `stop ${i}`,
      });
      locks.push(lock);
    }

    const TreasureHunt = await ethers.getContractFactory("TreasureHunt");
    const hook = await TreasureHunt.deploy(
      ...locks.map((lock) => lock.address)
    );
    await hook.deployed();

    // Configure all the locks
    for (let i = 0; i < passwords.length; i++) {
      const lock = locks[i];
      await (
        await lock.setEventHooks(
          hook.address,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
        )
      ).wait();

      const signer = await getSignerForPassword(passwords[i]);
      await hook.setSigner(lock.address, signer.address);
    }

    // Let's now try to buy all the keys in reverse order to show that it does not work!
    // Execpt for he first one of course!
    for (let i = 0; i < passwords.length - 1; i++) {
      const lock = locks[passwords.length - 1 - i];

      const goodSigner = await getSignerForPassword(
        passwords[passwords.length - 1 - i]
      );

      const data = await getSignatureFromSigner(
        user.address.toLowerCase(),
        goodSigner
      );
      await expect(
        lock.purchase(
          [0],
          [user.address],
          [user.address],
          [user.address],
          [data]
        )
      ).to.revertedWith("MISSING_PREVIOUS");
    }

    // Let's now buy all the keys one by one, but first with a bad password to make sure the password check is correct!
    for (let i = 0; i < passwords.length; i++) {
      const lock = locks[i];
      const badSigner = await getSignerForPassword("BAD PASSWORD");
      const badData = await getSignatureFromSigner(user.address, badSigner);
      // And now make a purchase that should fail because we did not submit a data
      await expect(
        lock.purchase(
          [0],
          [user.address],
          [user.address],
          [user.address],
          [badData]
        )
      ).to.revertedWith("WRONG_PASSWORD");

      const goodSigner = await getSignerForPassword(passwords[i]);

      const data = await getSignatureFromSigner(
        user.address.toLowerCase(),
        goodSigner
      );
      await expect(
        lock.purchase(
          [0],
          [user.address],
          [user.address],
          [user.address],
          [data]
        )
      ).to.not.reverted;
    }

    // Finally as a verification, let's ensure that the user has a key on all the locks!
    for (let i = 0; i < passwords.length; i++) {
      const lock = locks[i];
      expect(await lock.balanceOf(user.address)).to.equal(1);
    }
  });
});
