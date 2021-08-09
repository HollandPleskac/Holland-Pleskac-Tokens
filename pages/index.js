// todo - manage the HollandToken and hollandTokenAddress states in react context to clean up the code
// hook up token transfers
// hook up transactions history
// Done!
import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'

import HollandTokenContext from '../context/hollandTokenContext'

const decimals = ethers.BigNumber.from(10).pow(18)
// const url = 'http://localhost:3000/'
const url = 'https://holland-tokens.vercel.app/'

const HomePage = () => {
  const ctx = useContext(HollandTokenContext)

  const [account, setAccount] = useState(null)
  const [connection, setConnection] = useState(null)

  const isMetaMaskInstalled = async () => {
    // if they dont have metamask 'ethereum' doesnt exist, need to use 'window.ethereum'
    if (window.ethereum && window.ethereum.isMetaMask)
      return true
    return false
  }

  const isMetaMaskConnected = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0)
      return true
    return false
  }

  useEffect(() => {
    if (ctx.HollandToken) {

      const setConnectionState = async () => {
        if (!await isMetaMaskInstalled()) {
          setConnection('NOT INSTALLED')
          setAccount(null)
          return
        } else if (await isMetaMaskConnected()) {
          const accounts = await ethereum.request({ method: 'eth_accounts' })
          setConnection('CONNECTED')
          setAccount(accounts[0])
          return
        } else {
          setConnection('DISCONNECTED')
          setAccount(null)
          return
        }
      }

      setConnectionState() // initial state

      window.ethereum.on('accountsChanged', function (accounts) {
        console.log('accounts changed', accounts)
        setConnectionState()
      })
    }


  }, [ctx.HollandToken])

  return (
    <div className='h-screen flex flex-col items-center ' >
      <TopBar connection={connection} />
      <div className='w-full flex flex-grow' >
        <PageContent connection={connection} account={account} />
        <TransactionHistory account={account} />
      </div>
    </div>
  )
}

const TopBar = ({ connection }) => {
  return (
    <div className='z-10 w-full flex items-center justify-between px-8 py-6 bg-white shadow-md ' >
      <div className='flex items-center' >
        <FontAwesomeIcon icon={faAdjust} className='mr-3 text-4xl text-blue-500 ' />
        <h1 className='text-blue-500 text-xl font-bold' >HOL Token</h1>
      </div>
      <div>
        <AddTokenBtn />
        <MetaMaskBtn connection={connection} />
      </div>
    </div>
  )
}

const PageContent = ({ connection, account }) => {
  return (
    <div className='z-0 flex-grow flex flex-col justify-center items-center bg-background-gray' >
      {connection === 'DISCONNECTED' && <ConnectDirections text='Click “Connect to MetaMask” in the top right corner to interact with HOL Token!' />}
      {connection === 'NOT INSTALLED' && <InstallDirections text={`Click “Install MetaMask” in the${<br />} top right corner to get started!`} />}
      {
        connection === 'CONNECTED' && <>
          <Balance account={account} />
          <SendForm account={account} />
        </>
      }
    </div>
  )
}

const TransactionHistory = ({ account }) => {
  const ctx = useContext(HollandTokenContext)
  const [txHistory, setTxHistory] = useState([])

  useEffect(() => {
    const getTransferHistory = async () => {
      console.log('account when getting transfer', account)
      if (typeof window.ethereum !== undefined && account !== null) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        console.log(signer)
        const hollandToken = new ethers.Contract(ctx.hollandTokenAddress, ctx.HollandToken.abi, signer)
        try {
          const history = await hollandToken.getTransferHistory()
          setTxHistory(history)
          console.log('transaction history: ', history)
        } catch (err) {
          console.log('transaction history error: ', err)
        }
      }
    }

    getTransferHistory()
  }, [ctx.HollandToken, ctx.hollandTokenAddress, account])



  return (
    <div className='z-20 sm:w-4/12 md:w-3/12  overflow-y-scroll bg-white shadow-lg' >
      <div className='w-full mb-6 bg-gray-200' style={{ height: 1.5 }} ></div>
      {
        txHistory.map((tx, index) => {
          console.log('tx', tx)
          if (tx.transferType === 'add')
            return <Transaction key={index} amt={tx.amount.div(decimals).toNumber()} addr={tx.from} type={tx.transferType} />
          else
            return <Transaction key={index} amt={tx.amount.div(decimals).toNumber()} addr={tx.to} type={tx.transferType} />
        })
      }
      {/* <Transaction amt={20} addr={account} type='subtract' />
      <Transaction amt={10} addr={account} type='add' /> */}
    </div>
  )
}

const Transaction = ({ amt, addr, type }) => {
  if (addr === null)
    return <div></div>

  let shortAddress = addr.slice(0, 4) + '...' + addr.slice((-4))
  let color
  let sign
  if (type === 'add') {
    color = 'text-green-500'
    sign = '+'
    shortAddress = 'from '.concat(shortAddress)
  } else {
    color = 'text-red-500'
    sign = '-'
    shortAddress = 'to '.concat(shortAddress)
  }

  return (
    <div className='mx-10 mb-5 p-4 bg-background-gray rounded-lg' >
      <h3 className={`mb-1 text-lg ${color}`} >{sign}{amt} HOL</h3>
      <h4 className='text-gray-500 text-sm' >{shortAddress}</h4>
    </div>
  )
}

const Balance = ({ account }) => {
  const ctx = useContext(HollandTokenContext)

  const [balance, setBalance] = useState('')

  useEffect(() => {

    const setBal = async () => {
      if (typeof window.ethereum !== undefined && account !== null) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const hollandToken = new ethers.Contract(ctx.hollandTokenAddress, ctx.HollandToken.abi, provider)
        console.log('token in balance', hollandToken, ctx.hollandTokenAddress, account)
        try {
          const bal = await hollandToken.balanceOf(account)
          console.log('balance: ', ethers.BigNumber.from(bal).div(decimals))
          setBalance(ethers.BigNumber.from(bal).div(decimals).toNumber())
        } catch (err) {
          console.log('error: ', err)
          setBalance('error')
        }
      }
    }

    setBal()
  }, [ctx.HollandToken.abi, ctx.hollandTokenAddress, account])

  return (
    <>
      <h1 className='mb-2 text-7xl text-blue-500' >{balance}</h1>
      <h2 className='mb-8 text-lg text-gray-600' >Your balance of HOL</h2>
    </>
  )
}

const SendForm = ({ account }) => {
  const ctx = useContext(HollandTokenContext)

  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')

  const sendTokens = async () => {
    if (typeof window.ethereum !== undefined && account !== null) {
      console.log('address:', address, 'amount:', amount)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const hollandToken = new ethers.Contract(ctx.hollandTokenAddress, ctx.HollandToken.abi, signer)
      try {
        console.log('entered value * decimals', ethers.BigNumber.from(amount).mul(decimals))
        await hollandToken.transfer(address, ethers.BigNumber.from(amount).mul(decimals))
      } catch (err) {
        console.log('error: ', err)
      }
    }
  }


  return (
    <>
      <input
        value={address}
        onChange={(e) => { setAddress(e.target.value) }}
        placeholder='address'
        className='mb-4 px-4 py-2 border-2 rounded-lg border-gray-400 hover:border-blue-500 focus:outline-none focus:border-blue-600 transition ease-in duration-100'
        style={{ width: 350, height: 45 }}
      />
      <div className='relative' >
        <input
          value={amount}
          onChange={(e) => { setAmount(e.target.value) }}
          placeholder='amount'
          className='px-4 py-2 border-2 rounded-l-lg border-gray-400 hover:border-blue-500 focus:outline-none focus:border-blue-600 transition ease-in duration-100'
          style={{ width: 350, height: 45 }}
        />
        <button
          onClick={sendTokens}
          className='absolute px-4 py-2 bg-blue-500 text-white rounded-r-lg border-2 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600 transition ease-in duration-100'
          style={{ height: 45 }}
        >
          Send
        </button>
      </div>
    </>
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
  const ctx = useContext(HollandTokenContext)


  const tokenAddress = ctx.hollandTokenAddress;
  const tokenSymbol = 'HOL';
  const tokenDecimals = 18;
  const tokenImage = `${url}adjust-solid.svg`;

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
