// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract HollandToken is ERC20, Ownable {

  struct Transfer {
    string transferType;
    uint amount;
    address from;
    address to;
  }

    mapping(address => uint) public balances;
    mapping(address => Transfer[]) public transferHistory; // address => incoming or outcoming

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

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal virtual override
    {   
        super._afterTokenTransfer(from, to, amount);
        console.log('console logged after transfering the token!!');
        // transferHistory[from]['incoming'].push(amount);
        // transferHistory[to].push(amount);
    }

    
}