import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { signUp } from "../../api/auth"
import { SignUpParams } from "../../interfaces/user_interface"
import { AuthContext } from "../../App";

interface SignUpProps {
  signup: boolean
  setSignup: Function
}

export const SignUp = ({ signup, setSignup }: SignUpProps) => {
  const navigation = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  if(signup){
    const closeModal = () => {
      setSignup(false);
    }

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
          console.log("Signed up successfully!")
          setSignup(false);
        } else {
          console.log('signup is failed')
        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div>
      <h3 className="font-bold text-lg">SignUp!</h3>
        <form onSubmit={handleSubmit}>
          <p className="py-4">name</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={name} onChange={event => setName(event.target.value)} />
          <p className="py-4">email</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={email} onChange={event => setEmail(event.target.value)} />
          <p className="py-4">password</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={password} onChange={event => setPassword(event.target.value)} />
          <p className="py-4">passwordConfirmation</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={passwordConfirmation} onChange={event => setPasswordConfirmation(event.target.value)} />
          <br/>
          <input className="btn" type="submit" value="AddUser"/>
        </form>
        <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }
}

export default SignUp
