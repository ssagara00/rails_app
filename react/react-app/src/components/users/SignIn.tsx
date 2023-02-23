import React, { useContext } from "react"
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"

import { signIn } from "../../api/auth"
import { SignInParams } from "../../interfaces/user_interface"
import { AuthContext } from "../../App";

interface SignInProps {
  signin: boolean,
  setSignin: Function
}

export const SignIn = ({ signin, setSignin }: SignInProps) => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { register, handleSubmit,formState: { errors } } = useForm<SignInParams>();

    const onSubmit = async (data: SignInParams) => {

      try {
        const res = await signIn(data);
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
          console.log("Signed in missed")
        }
      } catch (err) {
        console.log(err)
      }
    }

    const closeModal = () => {
      setSignin(false);
    }

    return (
      <div>
        <h3 className="font-bold text-lg">SignIn!</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="py-4">email</p>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
              {...register('email', {
                required: {
                  value: true,
                  message: '入力が必須の項目です。',
                },
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: 'メールアドレスの形式が不正です。',
                }
              })}/>
              { errors.email?.message &&
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{errors.email.message}</span>
                  </div>
                </div>
              }

            <p className="py-4">password</p>
            <input type="password" placeholder="Type here" className="input input-bordered w-full max-w-xs"
              {...register('password', {
                required: {
                  value: true,
                  message: '入力が必須の項目です。',
                },
                minLength: {
                  value: 6,
                  message: '6文字以上入力してください。',
                },
                maxLength: {
                  value: 128,
                  message: '128文字以内で入力してください。',
                },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: 'パスワードは半角英数字のみ有効です。',
                }
              })}/>
              { errors.password?.message &&
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{errors.password.message}</span>
                  </div>
                </div>
              }
            <br/>
            <button className="btn" type="submit">SignIN</button>
          </form>
          <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }

export default SignIn
