import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'
import Cookies from 'js-cookie'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { signUp } from '../../api/api_actions'
import { SignUpParams } from '../../interfaces/interface'

interface SignUpProps {
  signup: boolean
  setSignup: React.Dispatch<React.SetStateAction<boolean>>
}

export const SignUp = ({ signup, setSignup }: SignUpProps) => {
  const { setIsSignedIn, setCurrentUser, setLoading } = useContext(AuthContext)

  const alert = useAlert()
  const { register, handleSubmit, getValues, trigger, formState: { errors } } = useForm<SignUpParams>({mode: "onBlur"})
  const [dialog, setDialog] = useState<DialogProps | undefined>()

  const closeModal = () => {
    setSignup(false)
  }

  const onSubmit = async(data: SignUpParams) =>{
    const ret = await new Promise<string>((resolve) => {
      setDialog({
      onClose: resolve,
      title: '会員登録',
      message: '会員登録します。よろしいですか?'
      })
    })
    setDialog(undefined)

    if (ret === 'ok') {
      try {
        const res = await signUp(data)
        if (res.status === 200) {
          alert.success('登録に成功しました')
          // 続けてログイン処理を行う。
          Cookies.set("_access_token", res.headers["access-token"])
          Cookies.set("_client", res.headers.client)
          Cookies.set("_uid", res.headers.uid)
          setIsSignedIn(true)
          setCurrentUser(res.data.data)
          alert.success('ログインに成功しました')
          // 非ログイン時に表示した投稿の重複を避けるため、現在の表示内容を削除し、スクロール状況をリセットする関数を起動する。
          setLoading(true)
          setSignup(false)
        } else {
          alert.error('登録に失敗しました。入力内容の形式に不備があります')
          console.log(res.data.message)
        }
      } catch (err) {
        alert.error('登録に失敗しました。しばらくしてからもう一度お試しください。または管理者にお問合せください')
        console.log(err)
      }
    }
  }

  return (
    <div>

      {dialog && <Dialog {...dialog} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form">
          <div className="head bg-neutral">
            <h2>会員登録</h2>
          </div>

          <p className="form-lead">名前</p>
          <input type="text" placeholder="Type name here" className="form-input"
            {...register('name', {
              required: {
                value: true,
                message: '名前を入力してください',
              },
              maxLength: {
                value: 100,
                message: '100文字以内で入力してください',
              }
            })}/>
            { errors.name?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.name.message}</span>
                </div>
              </div>
            }

          <p className="form-lead">メールアドレス</p>
          <input type="text" placeholder="Type email here" className="form-input"
            {...register('email', {
              required: {
                value: true,
                message: 'メールアドレスを入力してください',
              },
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
                message: 'メールアドレスの形式が不正です',
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

          <p className="form-lead">パスワード</p>
          <input type="password" placeholder="Type password here" className="form-input"
            {...register('password', {
              required: {
                value: true,
                message: 'パスワードを入力してください',
              },
              minLength: {
                value: 6,
                message: '6文字以上入力してください',
              },
              maxLength: {
                value: 128,
                message: '128文字以内で入力してください',
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'パスワードは半角英数字のみ有効です',
              },
              onBlur: () => {
                if(getValues("passwordConfirmation")){
                  trigger("passwordConfirmation")
                }
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

          <p className="form-lead">パスワード（確認）</p>
          <input type="password" placeholder="Type passwordconfirmation here" className="form-input"
            {...register('passwordConfirmation', {
              required: {
                value: true,
                message: '確認用パスワードを入力してください',
              },
              validate: (value)=> {
                return (
                  value === getValues("password") || "パスワードが一致しません"
                )
              }
            })}/>
            <br/>
            { errors.passwordConfirmation?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.passwordConfirmation.message}</span>
                </div>
              </div>
            }
          <br/>
          <button className="btn btn-secondary" type="submit">会員登録する</button>

        </div>
      </form>

      <div className="form-foot-btns">
        <button type="submit" onClick={closeModal} className="btn btn-secondary">閉じる</button>
      </div>
    </div>
  )
}
