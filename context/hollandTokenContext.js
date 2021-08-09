import React, { useEffect, useState } from 'react'
import axios from 'axios'

// const url = 'http://localhost:3000/' 
const url = 'https://holland-tokens.vercel.app/'

const HollandTokenContext = React.createContext({
  HollandToken: null,
  hollandTokenAddress: null,
})

export const HollandTokenContextProvider = (props) => {

  const [HollandToken, setHollandToken] = useState(null) // capital HollandToken refers to the compiled contract (not the abi)
  const [hollandTokenAddress, setHollandTokenAddress] = useState(null)

  const setHollandTokenData = async () => {
    try {
      const contract = await axios.get(`${url}HollandToken.json`).then(res => res.data)  // axios.get returns an http response obj, res.data = HollandToken
      const address = await axios.get(`${url}HollandTokenAddress.json`).then(res => res.data.address)
      setHollandToken(contract)
      setHollandTokenAddress(address)
      console.log('set holland token data')
    } catch (e) {
      console.log('err', e)
    }
  }

  useEffect(() => {
    setHollandTokenData()
  }, [])

  return (
    <HollandTokenContext.Provider value={{
      HollandToken: HollandToken,
      hollandTokenAddress: hollandTokenAddress,
    }} >
      {props.children}
    </HollandTokenContext.Provider>
  )

}

export default HollandTokenContext