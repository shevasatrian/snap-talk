import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "@/context/userContext";

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ChakraProvider>
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
