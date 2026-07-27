import React, { createContext, useEffect, useState } from 'react'
import AxiosCall from '../services/AxiosCall'

export const AuthContext = createContext()

export const AuthenticationProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await AxiosCall('GET', 'user/me')
                setUser(response.data?.data)
            } catch {
                setUser(null)
            }
        }
        checkAuthentication();
    }, [])
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}
