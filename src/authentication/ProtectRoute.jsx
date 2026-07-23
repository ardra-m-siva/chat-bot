import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectRoute = ({ children }) => {
    const { user } = useContext(AuthContext)
    if (!user)
        <Navigate to={'/login'} replace />
    return children
}

export default ProtectRoute