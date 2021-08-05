import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'

const HomePage = () => {
  return (
    <div className='h-screen flex flex-col items-center ' >
      <TopBar />
      <div className='w-full flex flex-grow' >
        <PageContent />
        <SideBar />
      </div>
    </div>
  )
}

const TopBar = () => {
  return (
    <div className='z-10 w-full flex items-center justify-between px-8 py-6 bg-white shadow-md ' >
      <div className='flex items-center' >
        <FontAwesomeIcon icon={faAdjust} className='mr-3 text-4xl text-blue-500 ' />
        <h1 className='text-blue-500 text-xl font-bold' >HOL Token</h1>
      </div>
      <div className='' >
        <AddTokenBtn />
        <MetaMaskBtn connection='CONNECTED' />
      </div>
    </div>
  )
}


const MetaMaskBtn = ({ connection }) => {

  const metaMaskBtnHandler = async () => {
    if (connection === 'DISCONNECTED')
      await window.ethereum.request({ method: "eth_requestAccounts" })
    else if (connection === 'NOT INSTALLED')
      router.push('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
    else if (connection === 'CONNECTED')
      console.log('Disconnect from MetaMask in the chrome extension')
  }

  return (
    <button
      onClick={metaMaskBtnHandler}
      className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ease-in duration-100'
    >
      {connection === 'DISCONNECTED' && 'Connect to MetaMask'}
      {connection === 'NOT INSTALLED' && 'Install MetaMask'}
      {connection === 'CONNECTED' && 'Connected to MetaMask'}
    </button>
  )
}

const AddTokenBtn = () => {

  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const tokenSymbol = 'HOL';
  const tokenDecimals = 18;
  const tokenImage = 'http://localhost:3000/adjust-solid.svg';

  const addTokenHandler = async () => {
    console.log('adding token')
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Added the token!');
      } else {
        console.log('User chose not to add the token.');
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <button
      onClick={addTokenHandler}
      className='px-4 py-2 mr-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ease-in duration-100'
    >
      Add HOL
    </button>
  )
}

const SideBar = () => {
  return (
    <div className='z-20 sm:w-4/12 md:w-3/12  bg-white shadow-lg' >
      <div className='w-full mb-5 bg-gray-200 overflow-y-scroll' style={{ height: 1.5 }} ></div>
      <Transaction amt={20} addr='0x9F...Bd14' type='subtract' />
      <Transaction amt={10} addr='0x9F...Bd14' type='add' />
    </div>
  )
}

const Transaction = ({ amt, addr, type }) => {
  const shortAddress = addr.slice(0, 4) + '...' + addr.slice((-4))
  let color
  let sign
  if (type === 'subtract') {
    color = 'text-red-500'
    sign = '-'
    'to '.concat(shortAddress)
  } else {
    color = 'text-green-500'
    sign = '+'
    'from '.concat(shortAddress)
  }

  return (
    <div className='mx-8 mb-5 p-5 bg-background-gray rounded-lg' >
      <h3 className={`mb-1 text-lg ${color}`} >{sign}{amt} HOL</h3>
      <h4 className='text-gray-500 text-sm' >{shortAddress}</h4>
    </div>
  )
}


const PageContent = () => {
  return (
    <div className='z-0 flex-grow flex flex-col justify-center items-center bg-background-gray' >
      <h1 className='mb-2 text-7xl text-blue-500' >100000</h1>
      <h2 className='mb-8 text-lg text-gray-600' >Your balance of HOL</h2>

      <SendHOL />
      {/* <InstallDirections text={`Click “Install MetaMask” in the${<br />} top right corner to get started!`} /> */}
      {/* <ConnectDirections text='Click “Connect to MetaMask” in the top right corner to interact with HOL Token!' /> */}
    </div>
  )
}

const SendHOL = () => {
  return (
    <>
      <input
        placeholder='address'
        className='mb-4 px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 transition ease-in duration-100'
        style={{ width: 350, height: 45 }}
      />
      <div className='relative' >
        <input
          placeholder='amount'
          className='px-4 py-2 border-2 border-black rounded-l-lg focus:outline-none focus:border-blue-600 transition ease-in duration-100'
          style={{ width: 350, height: 45 }}
        />
        <button
          className='absolute px-4 py-2 bg-blue-500 text-white rounded-r-lg border-2 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600 transition ease-in duration-100'
          style={{ height: 45 }}
        >
          Send
        </button>
      </div>
    </>
  )
}


const InstallDirections = () => {
  return (
    <p className='text-lg text-gray-600' >
      Click “Install MetaMask” in the<br />top right corner to get started!
    </p>
  )
}

const ConnectDirections = () => {
  return (
    <p className='text-lg text-gray-600' >
      Click “Connect to MetaMask” in the top<br />right corner to interact with HOL Token!
    </p>
  )
}

export default HomePage
