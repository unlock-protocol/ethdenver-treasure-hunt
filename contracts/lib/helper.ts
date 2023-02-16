const { ethers } = require("hardhat");

export const getSignerForPassword = async (password: string) => {
  // Build the signer
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ["bytes32"],
    [ethers.utils.id(password)]
  );
  const privateKey = ethers.utils.keccak256(encoded);
  return new ethers.Wallet(privateKey);
};

export const getSignatureFromSigner = async (message: string, signer: any) => {
  // Sign
  const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
  const messageHashBinary = ethers.utils.arrayify(messageHash);
  const signature = await signer.signMessage(messageHashBinary);

  return signature;
};

// These are just password for the tests
// The real ones will be different :D
export const passwords = [
  "UnlockTheWeb", // Get it from the Unlock Discord
  "CoinviseRocks", // Get it from te Coinvise discord
  "ThirdWebDevs", // Get it from the ThirdWeb Discord
  "WIFI_PASSWORD", // Get it from the main venue
  "WelcomeToTheClub", // Get it from the Unlock + coinvise party!
];
