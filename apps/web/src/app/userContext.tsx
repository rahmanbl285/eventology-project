'use client'

import { API_URL, token } from "@/lib/utils"
import { UserContextType, UserInfo } from "@/types"
import { createContext, ReactNode, useEffect, useState } from "react"

export const UserContext = createContext<UserContextType | null>(null)

export function UserContextProvider ({ children }: { children: ReactNode }) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const getData = async () => {
        try {
            if (!token) return
            const response = await fetch(`${API_URL}users/keep-login`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })

            const data = await response.json()
            console.log('data: ', data);
            
            setUserInfo(data)
        } catch (err) {
            console.log(err);  
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}