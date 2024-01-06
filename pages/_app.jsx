import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { UserContextProvider } from '@/context/userContext'
import { QueryClient, QueryClientProvider } from 'react-query'

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ChakraProvider>
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </ChakraProvider> 
    </QueryClientProvider>
  )
  
 
}
