// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        uint256 deployerKey;
        uint256 minimumMintPrice;
        string networkName;
        uint256 gasPrice;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 31337) {
            // Anvil/Localhost
            activeNetworkConfig = NetworkConfig({
                deployerKey: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
                minimumMintPrice: 0.01 ether,
                networkName: "Anvil",
                gasPrice: 20000000000 // 20 gwei
            });
        } else if (block.chainid == 11155111) {
            // Sepolia Testnet
            activeNetworkConfig = NetworkConfig({
                deployerKey: vm.envUint("PRIVATE_KEY"),
                minimumMintPrice: 0.01 ether,
                networkName: "Sepolia",
                gasPrice: vm.envUint("GAS_PRICE")
            });
        } else if (block.chainid == 1) {
            // Ethereum Mainnet
            activeNetworkConfig = NetworkConfig({
                deployerKey: vm.envUint("PRIVATE_KEY"),
                minimumMintPrice: 0.01 ether,
                networkName: "Ethereum",
                gasPrice: vm.envUint("GAS_PRICE")
            });
        } else {
            revert("Unsupported network");
        }
    }
}