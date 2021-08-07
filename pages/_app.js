import '../styles/globals.css'
import { HollandTokenContextProvider } from '../context/hollandTokenContext'

function MyApp({ Component, pageProps }) {
  return (
    <HollandTokenContextProvider>
      <Component {...pageProps} />
    </HollandTokenContextProvider>
  )
}

export default MyApp
