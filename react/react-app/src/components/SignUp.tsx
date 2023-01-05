import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { signUp } from "api/auth"
import { SignUpParams } from "interfaces/user_interface"
import { AuthContext } from "../App"

// サインアップ用ページ
export const SignUp = () => {
  const navigation = useNavigate()

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const params: SignUpParams = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }

    try {
      const res = await signUp(params)
      console.log(res)

      if (res.status === 200) {
        // アカウント作成と同時にログインさせてしまう
        // 本来であればメール確認などを挟むべきだが、今回はサンプルなので
        {/*Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigation.push("/auth")*/}

        console.log("Signed in successfully!")
      } else {
console.log('signin is failed')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h2>入力フォーム</h2>
      <form onSubmit={handleSubmit}>
        <p>name</p>
        <input
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
        />
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
        <p>passwordConfirmation</p>
        <input
          type="text"
          value={passwordConfirmation}
          onChange={event => setPasswordConfirmation(event.target.value)}
        />
        <input type="submit" value="AddUser"/>
      </form>
    </div>
  )
}

export default SignUp
