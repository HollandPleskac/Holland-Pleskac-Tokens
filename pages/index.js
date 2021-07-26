import React, { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

const HomePage = () => {
  const [greeting, setGreetingValue] = useState()

  const requestAccount = async () => {
    await window.ethereum.request({'method': 'eth_requestAccounts'}) // prompt user to connect meta mask account if not connected (returs accounts array)
  }


  const fetchGreeting = async () => {
    if (typeof window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log('error: ', err)
      }
    }
  }

  const setGreeting = async () => {
    if (!greeting) return
    if (typeof window.ethereum !== undefined) {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer) // create a transaction with signer (pass in signer instead of provider like above)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }



  return (
    <div className='h-screen flex justify-center items-center' >
      Home Page
    </div>
  )
}

export default HomePage
