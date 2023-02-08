// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV12.sol";

error WRONG_PASSWORD();
error NOT_AUTHORIZED();
error MISSING_PREVIOUS();

contract TreasureHunt {
  mapping(address => address) public previousLock;
  mapping(address => address) public signers;

  // initialize with the locks
  constructor(address lock1, address lock2, address lock3, address lock4, address lock5) payable {
    previousLock[lock2] = lock1;
    previousLock[lock3] = lock2;
    previousLock[lock4] = lock3;
    previousLock[lock5] = lock4;
  }

  /**
   * Function to set the signer for a lock.
   */
  function setSigner(address lock, address signer) public {
      if (!IPublicLockV12(lock).isLockManager(msg.sender)) {
          revert NOT_AUTHORIZED();
      }
      signers[lock] = signer;
  }

  /**
   * Price is the same for everyone... 
   * but we fail if signer of data does not match the lock's password.
   */
  function keyPurchasePrice(
      address, /* from */
      address recipient,
      address, /* referrer */
      bytes calldata signature /* data */
  ) external view returns (uint256 minKeyPrice) {
    // Check password
    if(getSigner(toString(recipient), signature) != signers[msg.sender]) {
      revert WRONG_PASSWORD();
    }

    // Check if the user has a key to the previous lock
    address previous = previousLock[msg.sender];
    if (previous != address(0x0)) {
      if (IPublicLockV12(previous).balanceOf(recipient) == 0) {
        revert MISSING_PREVIOUS();
      }
    }

    return IPublicLockV12(msg.sender).keyPrice();
    
  }

  /**
   * Debug function
   */
  function getSigner(
      string memory message,
      bytes calldata signature
  ) private pure returns (address recoveredAddress) {
      bytes32 hash = keccak256(abi.encodePacked(message));
      bytes32 signedMessageHash = ECDSA.toEthSignedMessageHash(hash);
      return ECDSA.recover(signedMessageHash, signature);
  }

  /**
   * Helper functions to turn address into string so we can verify 
   * the signature (address is signed as string on the client)
   */
  function toString(address account) private pure returns (string memory) {
      return toString(abi.encodePacked(account));
  }

  function toString(uint256 value) private pure returns (string memory) {
      return toString(abi.encodePacked(value));
  }

  function toString(bytes32 value) private pure returns (string memory) {
      return toString(abi.encodePacked(value));
  }

  function toString(bytes memory data) private pure returns (string memory) {
      bytes memory alphabet = "0123456789abcdef";

      bytes memory str = new bytes(2 + data.length * 2);
      str[0] = "0";
      str[1] = "x";
      for (uint256 i = 0; i < data.length; i++) {
          str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
          str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
      }
      return string(str);
  }

  /**
   * No-op but required for the hook to work
   */
  function onKeyPurchase(
      uint256, /* tokenId */
      address, /*from*/
      address, /*recipient*/
      address, /*referrer*/
      bytes calldata, /*data*/
      uint256, /*minKeyPrice*/
      uint256 /*pricePaid*/
  ) external {
  }
}