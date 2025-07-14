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

    uint256 gasPrice = vm.envUint("GAS_PRICE");
    NetworkConfig public activeNetworkConfig;

    function getAnvilNetworkConfig()
        internal
        view
        returns (NetworkConfig memory)
    {
        return
            NetworkConfig({
                deployerKey: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
                minimumMintPrice: 0.01 ether,
                networkName: "Anvil",
                gasPrice: gasPrice
            });
    }

    function getSepoliaNetworkConfig()
        internal
        view
        returns (NetworkConfig memory)
    {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        return
            NetworkConfig({
                deployerKey: privateKey,
                minimumMintPrice: 0.01 ether,
                networkName: "Sepolia",
                gasPrice: gasPrice
            });
    }

    constructor() {
        if (block.chainid == 31337) {
            // Anvil/Localhost
            activeNetworkConfig = getAnvilNetworkConfig();
        } else if (block.chainid == 11155111) {
            // Sepolia Testnet
            activeNetworkConfig = getSepoliaNetworkConfig();
        } else {
            revert("Unsupported network");
        }
    }
}
