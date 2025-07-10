# NFT Minting App

This repository contains a manually built, personal NFT minting smart contract project. The goal was to learn and implement the core concepts of NFT creation, minting limits, and player tracking using Solidity and Foundry.

## Learnings & Features

- **Manual Implementation:** All logic was written from scratch, without using contract generators or wizards.
- **ERC-721 Standard:** Utilizes OpenZeppelin’s [ERC721](lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol) and [ERC721URIStorage](lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol) for NFT functionality.

- **Minting Logic:** 
  - Minimum mint price enforced (`MINIMUM_MINT_PRICE`).
  - Each address can mint up to 5 NFTs.
  - Tracks all players who have minted NFTs.
  - Emits an event on every mint.
- **Player Tracking:** Uses a mapping and array to count tokens per player and store player addresses.
- **Token Metadata:** Each NFT can have a unique URI set at mint time.

## Manual Project Notes

- No contract wizard or template was used; all code was written and debugged manually.
- This project helped reinforce understanding of Solidity mappings, arrays, events, and inheritance.

## License

MIT
