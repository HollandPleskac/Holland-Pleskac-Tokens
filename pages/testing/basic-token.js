// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

import React, { useState } from 'react'
import { ethers } from 'ethers'
import Token from '../../artifacts/contracts/Token.sol/Token.json'

const tokenAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

const HomePage = () => {

  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)
  const requestAccount = async () => {
    console.log('requesting meta mask accounts')
    await window.ethereum.request({ 'method': 'eth_requestAccounts' }) // prompt user to connect meta mask account if not connected (returs accounts array)
  }

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  const sendCoins = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }



  return (
    <div className='h-screen flex flex-col justify-center items-center' >
      Token
      <button onClick={getBalance} >Get Balance</button>
      <button onClick={sendCoins} >Send Coins</button>
      <input onChange={e => setUserAccount(e.target.value)} placeholder='Account Id' />
      <input onChange={e => setAmount(e.target.value)} type="text" placeholder='Amount' />
    </div>
  )
}

export default HomePage
