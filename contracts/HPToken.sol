//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract Token is ERC20 {
  constructor() ERC20("Holland Pleskac Token", "HPT") {
        _mint(msg.sender, 100000 * (10 ** 18)); // initial supply (tokens have 18 decimal places, need to divide by 10^decimals to get the actual HPT amount)
    }
}