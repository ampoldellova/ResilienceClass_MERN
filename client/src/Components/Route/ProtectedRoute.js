import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getUser } from '../../utils/helpers';

const ProtectedRoute = ({ children = false }) => {
    const [loading, setLoading] = useState(getUser() === false && false)
    const [user, setUser] = useState(getUser())
    console.log(children.type.name, loading)

    if (!user) {
        return <Navigate to='/login' />
    }

    return children
};

export default ProtectedRoute;