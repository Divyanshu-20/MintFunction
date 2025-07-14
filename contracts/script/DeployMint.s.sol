// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {NFTMinting} from "../src/mint.sol";
import "./HelperConfig.s.sol";
import {Script} from "forge-std/Script.sol";

contract DeployMint is Script { 
    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        (
            uint256 deployerKey,
            uint256 minimumMintPrice,
            ,
            
        ) = helperConfig.activeNetworkConfig();
        
        vm.startBroadcast(deployerKey);
        NFTMinting mint = new NFTMinting(minimumMintPrice);
        vm.stopBroadcast();
    }  
}
