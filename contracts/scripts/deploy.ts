import { ethers, unlock } from "hardhat";
import { passwords, getSignerForPassword } from "../lib/helper";

async function main() {
  // Ok so we need to deploy 5 locks, set Julien as lock Manager,
  // Deploy the hook
  const [user] = await ethers.getSigners();

  const expirationDuration = ethers.constants.MaxUint256;
  const maxNumberOfKeys = ethers.constants.MaxUint256;
  const keyPrice = 0;
  const locks = [];

  // Create all the locks
  for (let i = 0; i < passwords.length; i++) {
    const { lock } = await unlock.createLock({
      expirationDuration,
      maxNumberOfKeys,
      keyPrice,
      name: `ETHDenver Treasure Hunt Stop ${i}`,
    });
    locks.push(lock);
  }

  const TreasureHunt = await ethers.getContractFactory("TreasureHunt");
  const hook = await TreasureHunt.deploy(...locks.map((lock) => lock.address));
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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
