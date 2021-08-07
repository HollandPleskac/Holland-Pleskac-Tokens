import React, { useEffect, useState } from 'react'

const HollandTokenContext = React.createContext({

})

export const HollandTokenContextProvider = (props) => {

  return (
    <HollandTokenContext.Provider value={{
    }} >
      {props.children}
    </HollandTokenContext.Provider>
  )

}

export default HollandTokenContext