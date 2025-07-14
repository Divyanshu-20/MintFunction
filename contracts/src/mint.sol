// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMinting is ERC721URIStorage {
    uint256 public MINIMUM_MINT_PRICE;
    uint256 private nextTokenId;
    address[] public players;
    mapping(address => uint256) public playerTokenCount;

    event NFTMintedBy(address indexed player);

    constructor(uint256 _minimumMintPrice) ERC721("NFTMinting", "MNFT") {
        MINIMUM_MINT_PRICE = _minimumMintPrice;
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

        playerTokenCount[msg.sender]++; //For each mint, increment the player's token count
        emit NFTMintedBy(msg.sender);
        return tokenId;
    }

    //Getter Functions
    function getPlayersLength() public view returns (uint256) {
        return players.length;
    }
}
