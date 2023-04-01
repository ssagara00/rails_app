import React, { useState, useMemo, createContext } from 'react'

import { User } from './interfaces/interface'

interface ContextValueType {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const AuthContext = createContext({} as ContextValueType)

export const AuthProvider = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const { children } = props

  // useMemoで囲むことで不要な際レンダリングを防ぐ
  const contextValue: ContextValueType = useMemo(() => ({
    loading,
    setLoading,
    isSignedIn,
    setIsSignedIn,
    currentUser,
    setCurrentUser
  }), [ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser ])

  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
