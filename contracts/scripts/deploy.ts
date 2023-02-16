import { ethers, unlock } from "hardhat";
import { passwords, getSignerForPassword } from "../lib/helper";

const addresses = [
  "0xf91a25a08f33354c5854762cbb219602b2f00db7",
  "0x90f0546ba5bc01a5923a87304dbc41212a844da6",
  "0x470bc03443bcc9c349a7d9c45a11f5cfbb81094e",
  "0x51991af02a3fe3d1f85f2e76aec3f3aa1e7476af",
  "0xcc65592e31832621b81aa12abe5bfef549632cf4",
];

async function main() {
  // Ok so we need to deploy 5 locks, set Julien as lock Manager,
  // Deploy the hook
  const [user] = await ethers.getSigners();
  console.log(user.address);

  const expirationDuration = ethers.constants.MaxUint256;
  const maxNumberOfKeys = ethers.constants.MaxUint256;
  const keyPrice = 0;
  const locks = [];

  // Create all the locks
  for (let i = 0; i < passwords.length; i++) {
    const lock = await unlock.getLockContract(addresses[i]);
    console.log(`Deployed ${i + 1} ${await lock.name()} at ${lock.address}`);
    locks.push(lock);
  }

  const TreasureHunt = await ethers.getContractFactory("TreasureHunt");
  const hook = await TreasureHunt.attach(
    "0xa8772D3cEf8DDA49CB34d070f66e4f20cb829A83"
  );
  console.log(`Deployed hook at ${hook.address}`);

  // Configure all the locks
  for (let i = 0; i < passwords.length; i++) {
    const lock = locks[i];
    try {
      const setHooks = await lock.setEventHooks(
        hook.address,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero
      );

      await setHooks.wait();

      console.log(`Hook added to ${lock.address}`);

      const signer = await getSignerForPassword(passwords[i]);
      await (await hook.setSigner(lock.address, signer.address)).wait();
      console.log(`Password added for ${lock.address}`);

      // Add julien and chris as lock managers
      await (
        await lock.addLockManager("0x4Ce2DD8373ECe0d7baAA16E559A5817CC875b16a")
      ).wait();
      console.log(`julien51 added as lock manager for ${lock.address}`);

      await (
        await lock.addLockManager("0x9d3ea9e9adde71141f4534dB3b9B80dF3D03Ee5f")
      ).wait();
      console.log(`ccarfi added as lock manager for ${lock.address}`);
      await (await lock.renounceLockManager()).wait();
      console.log(`renounced lock manager for ${lock.address}`);
    } catch (error) {
      console.error(error);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
