import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { signIn } from "api/auth"
import { SignInParams } from "interfaces/user_interface"
import { AuthContext } from "../App"

// サインイン用ページ
export const SignIn = () => {
  const navigation = useNavigate()

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const params: SignInParams = {
      email: email,
      password: password
    }

    try {
      const res = await signIn(params)
      console.log(res)

      if (res.status === 200) {
        // ログインに成功した場合はCookieに各値を格納
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigation("/auth")

        console.log("Signed in successfully!")
      } else {

      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
    <h2>sign IN</h2>
      <form onSubmit={handleSubmit}>
        <p>email</p>
        <input
          type="text"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <p>password</p>
        <input
          type="text"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <input type="submit" value="Login"/>
      </form>
    </div>
  )
}

export default SignIn
