import React, { useLayoutEffect } from 'react'
import localStorageContent from '../../utils/localstorage'
import { useNavigate } from 'react-router-dom'

function ProtectRoutes({ children }: any) {
    const navigate = useNavigate()
    useLayoutEffect(() => {
    if(!localStorageContent.getUserData()){
        navigate('/')
    }
   }, [])
  return (
    <>
        {children}
    </>
  )
}

export default ProtectRoutes