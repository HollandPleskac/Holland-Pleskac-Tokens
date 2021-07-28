import React, { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

const HomePage = () => {
  const [greeting, setGreetingValue] = useState('')

  const requestAccount = async () => {
    console.log('requesting meta mask accounts')
    await window.ethereum.request({ 'method': 'eth_requestAccounts' }) // prompt user to connect meta mask account if not connected (returs accounts array)
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
      setGreetingValue('')
      await transaction.wait() // wait for transaction to confirm on blockchain
      fetchGreeting()
    }
  }

  return (
    <div className='h-screen flex flex-col justify-center items-center' >
      <button onClick={requestAccount} >Request accounts</button>
      <button onClick={fetchGreeting} className='p-1 border-2 border-gray-400 rounded' >Fetch Greeting</button>
      <button onClick={setGreeting} className='p-1 border-2 border-gray-400 rounded' >Set Greeting</button>
      <input
        type="text"
        onChange={e => setGreetingValue(e.target.value)}
        placeholder='set greeting'
        value={greeting}
        className='border-2 border-gray-400'
      />
    </div>
  )
}

export default HomePage
