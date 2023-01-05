import React, { useEffect, useState, createContext } from "react";
import { User } from "../interfaces/user_interface"
import { getCurrentUser } from "../api/auth"
import { Link } from 'react-router-dom';
import { signOut } from "../api/auth"
import { SignIn } from "./SignIn"

export const Auth = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>("")

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()

      if (res?.data.isLogin === true) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)

        console.log(res?.data.data)
      } else {
        console.log("No current user")
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser])

  const handleSignOut = async (e) => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
          // サインアウト時には各Cookieを削除
          Cookies.remove("_access_token")
          Cookies.remove("_client")
          Cookies.remove("_uid")

          setIsSignedIn(false)
          navigation.push("/auth")

          console.log("Succeeded in sign out")
        } else {
          console.log("Failed in sign out")
        }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1>会員登録済画面</h1>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>Signed in successfully!</h1>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Name: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }
      <p>login</p>
        <Link to={'/auth/signin/'}>Link to signin</Link>
      <p>logout</p>
      <form onSubmit={handleSignOut}>
        <input type="submit" value="logout"/>
      </form>
      <p>signup</p>
        <Link to={'/auth/signup/'}>Link to signup</Link>
    </div>
  )
}

export default Auth
