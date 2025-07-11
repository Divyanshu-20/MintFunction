// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMinting is ERC721URIStorage {

    uint256 public MINIMUM_MINT_PRICE = 0.01 ether;
    uint256 private nextTokenId;
    address[] public players;
    mapping(address => uint256) public playerTokenCount;

    event NFTMintedBy(address indexed player);

    constructor() ERC721("NFTMinting", "MNFT") {
        nextTokenId = 1;
    }

    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= MINIMUM_MINT_PRICE, "Insufficient ETH");
        require(playerTokenCount[msg.sender] < 5, "Mint limit reached");

        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        if (playerTokenCount[msg.sender] == 0) {
            players.push(msg.sender);
        }

        playerTokenCount[msg.sender]++;
        emit NFTMintedBy(msg.sender);
        return tokenId;
    }
}
