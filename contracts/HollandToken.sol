// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract HollandToken is ERC20, Ownable {
    mapping(address => uint) balances;

    constructor() ERC20("Holland Token", "HOL") {
      balances[msg.sender] = 100;
      _mint(msg.sender, 100 * (10 ** 18)); // initial supply (tokens * (10 ** decimals) divide by 10^decimals to get actual HOL value)
    }

    function mint(address to, uint256 amount) public onlyOwner {
      _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
      _burn(from, amount);
    }

    
}