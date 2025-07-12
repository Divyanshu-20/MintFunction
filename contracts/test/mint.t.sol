// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/mint.sol";

contract NFTMintingTest is Test {

    address public PLAYER = address(1);

    function testMinimumMintPricethrowsError() public {
        vm.prank(PLAYER);
        vm.expectRevert("Insufficient ETH");
        mintNFT("https://example.com/token/1");
    }
}