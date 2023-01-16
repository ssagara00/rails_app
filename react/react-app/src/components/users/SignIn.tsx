import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { signIn } from "../../api/auth"
import { SignInParams } from "../../interfaces/user_interface"
import { AuthContext } from "../../App";

interface SignInProps {
  signin: boolean
  setSignin: Function
}

export const SignIn = ({ signin, setSignin }: SignInProps) => {
  const navigation = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  if(signin){
    const closeModal = () => {
      setSignin(false);
    }

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
          console.log("Signed in successfully!")
          setSignin(false);
        } else {

        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div>
        <h3 className="font-bold text-lg">SignIn!</h3>
          <form onSubmit={handleSubmit}>
            <p className="py-4">email</p>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={email} onChange={event => setEmail(event.target.value)} />
            <p className="py-4">password</p>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={password} onChange={event => setPassword(event.target.value)} />
            <br/>
            <input className="btn" type="submit" value="Login"/>
          </form>
          <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }
}

export default SignIn
