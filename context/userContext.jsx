import { createContext } from "react";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";

export const UserContext = createContext({})

export function UserContextProvider({ children, ...props }) {
  const { data: userData } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/user/me",
    headers: { 'Authorization': `Bearer ${Cookies.get('user_token')}` },
  })

  return (
    <UserContext.Provider value={userData?.data || null} {...props}>
      {children}
    </UserContext.Provider>
  )
}