import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'
import Cookies from 'js-cookie'

import { AuthContext } from '../../Context'
import { signIn } from '../../api/api_actions'
import { SignInParams } from '../../interfaces/interface'

interface SignInProps {
  signin: boolean,
  setSignin: React.Dispatch<React.SetStateAction<boolean>>
}

export const SignIn = ({ signin, setSignin }: SignInProps) => {
  const { setIsSignedIn, setCurrentUser, setLoading } = useContext(AuthContext)

  const alert = useAlert()
  const { register, handleSubmit,formState: { errors } } = useForm<SignInParams>()

  const closeModal = () => {
    setSignin(false)
  }

  const onSubmit = async (data: SignInParams) => {

    try {
      const res = await signIn(data)
      if (res.status === 200) {
        alert.success('ログインに成功しました')
        // ログインに成功した場合はCookieに各値を格納
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers.client)
        Cookies.set("_uid", res.headers.uid)
        setIsSignedIn(true)
        setCurrentUser(res.data.data)
        // 非ログイン時に表示した投稿の重複を避けるため、現在の表示内容を削除し、スクロール状況をリセットする関数を起動する。
        setLoading(true)
        setSignin(false)
      } else {
        alert.error('ログインに失敗しました')
        console.log("Signed in missed")
      }
    } catch (err) {
      alert.error('ログインに失敗しました')
      console.log(err)
    }
  }

  return (
    <div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div className="head bg-neutral">
            <h2>SIGN IN</h2>
          </div>

          <p className="form-title">Email</p>
          <input type="text" placeholder="Type email here" className="inputarea"
            {...register('email', {
              required: {
                value: true,
                message: 'メールアドレスを入力してください。',
              },
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
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

          <p className="form-title">Password</p>
          <input type="password" placeholder="Type password here" className="inputarea"
            {...register('password', {
              required: {
                value: true,
                message: 'パスワードを入力してください。',
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
          <button className="btn btn-secondary" type="submit">SignIN</button>

        </div>
      </form>

      <div className="footbtns">
        <button type="submit" onClick={closeModal} className="btn btn-secondary">Close Modal</button>
      </div>
    </div>
  )
}
