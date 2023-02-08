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
