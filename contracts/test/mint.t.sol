// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/mint.sol";

contract NFTMintingTest is Test {
    address public PLAYER = address(1);
    NFTMinting public mintContract;

    function setUp() public {
        mintContract = new NFTMinting(0.01 ether);
    }

    function testMinimumMintPricethrowsError() public {
        vm.prank(PLAYER);
        vm.expectRevert("Insufficient ETH");
        mintContract.mintNFT("https://example.com/token/1");
    }

    function testIfPlayerIsPushedToArrayTwice() public {
        vm.deal(PLAYER, 10 ether);
        vm.prank(PLAYER);
        mintContract.mintNFT{value: 0.01 ether}("https://example.com/token/1");

        vm.prank(PLAYER);
        mintContract.mintNFT{value: 0.01 ether}("https://example.com/token/2");

        //Checking the length of the array to test
        assertEq(mintContract.getPlayersLength(), 1);
    }

    function testIfPlayerCanMintMoreThan5NFTs() public {
        vm.deal(PLAYER, 10 ether);

        for (uint256 i = 0; i < 5; i++) {
            vm.prank(PLAYER);
            mintContract.mintNFT{value: 0.01 ether}(
                string(abi.encodePacked("https://example.com/token/", i + 1))
            );
        }
        vm.prank(PLAYER);
        vm.expectRevert("Mint limit reached");
        mintContract.mintNFT{value: 0.01 ether}("https://example.com/token/6");
    }
}
