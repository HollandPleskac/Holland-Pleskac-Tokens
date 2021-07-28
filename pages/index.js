import React, { useState } from 'react'
import { ethers } from 'ethers'

const HomePage = () => {
  return (
    <div className='h-screen flex' >
      <div className='flex-1 flex flex-col justify-center items-center' >
        <Balance />
        <SendForm />
      </div>
      <TransactionHistory />
    </div>
  )
}

const Balance = () => {
  return (
    <>
      <h1 className='text-7xl mb-2 text-gray-800' >1000.22</h1>
      <h1 className='mb-2 text-gray-800' >Your balance of HPT</h1>
    </>
  )
}

const SendForm = () => {
  return (
    <div className='mt-2 p-4' >
      <input type="text" placeholder='Address' className='px-4 py-2 rounded border-2 focus:border-green-300 outline-none transition ease-in duration-100' />
      <div>
        <input type="text" placeholder='Amount' className='px-4 py-2 mt-2 rounded-l border-2 focus:border-green-300 outline-none transition ease-in duration-100' />
        <button className='px-3 py-2 border-2 border-green-300 bg-green-300 rounded-r hover:border-green-400 hover:bg-green-400 focus:bg-green-400 focus:border-green-400  transition ease-in duration-100' >Send</button>
      </div>
    </div>
  )
}

const TransactionHistory = () => {
  return (
    <div className='h-full w-1/4 p-8 flex flex-col items-center bg-green-400'>
      <h2 className='font-semibold text-lg mb-4' >Transaction History</h2>
      <Transaction amount='20' type='+' address='0x28aF3' />
    </div>
  )
}

const Transaction = ({ amount, type, address }) => {

  const colorClasses = type === '+' ? 'text-green-400' : 'text-red-400'

  return (
    <div className='w-full mb-2 flex flex-col bg-white rounded p-4' >
      <div>
        <span className={`font-bold ${colorClasses}`} >{type}{amount}</span>
        <span className='font-semibold text-gray-600'> HPT</span>
      </div>
      <div>
        <span className='text-gray-600' >to {address}</span>
      </div>
    </div >
  )
}

export default HomePage
