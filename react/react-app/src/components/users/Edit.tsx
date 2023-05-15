import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { editUser } from '../../api/api_actions'
import { SignEditParams } from '../../interfaces/interface'

interface UserEditProps {
  edit: boolean
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const Edit = ({ edit, setEdit }: UserEditProps) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const user_id = currentUser?.id
  const user_name = currentUser?.name
  const user_mail = currentUser?.email

  const alert = useAlert()
  const { register, handleSubmit, formState: { errors }  } = useForm<SignEditParams>({ defaultValues: { name: user_name, email: user_mail } })
  const [dialog, setDialog] = useState<DialogProps | undefined>()

  const closeModal = () => {
    setEdit(false)
  }

  const onSubmit = async(data: SignEditParams) =>{
    const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: 'ユーザー情報編集',
        message: 'ユーザー情報を更新します。よろしいですか?'
      })
    })
    setDialog(undefined)

    if (ret === 'ok' && user_id) {
      const formData = new FormData()
      formData.append("user[name]", data.name)
      formData.append("user[email]", data.email)

      try {
        const res = await editUser(user_id, formData as any)
        if (res.status === 200) {
          alert.success('更新に成功しました')
          setCurrentUser(res.data.data)
          setEdit(false)
        } else {
          alert.error('更新に失敗しました。入力内容の形式に不備があります。')
          console.log(res.data.message)
        }
      } catch (err) {
        alert.error('更新に失敗しました。しばらくしてからもう一度お試しください。または管理者にお問合せください。')
        console.log(err)
      }
    }
  }
  
  return(
    <div>

      {dialog && <Dialog {...dialog} />}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form">
          <div className="head bg-neutral">
            <h2>ユーザー情報更新</h2>
          </div>

          <p className="form-lead">名前</p>
          <input type="text" placeholder="Type name here" className="form-input"
            {...register('name', {
              required: {
                value: true,
                message: '名前を入力してください。',
              },
              maxLength: {
                value: 100,
                message: '100文字以内で入力してください。',
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
                message: 'メールアドレスを入力してください。',
              },
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
                message: 'メールアドレスの形式が不正です。',
              }
            })}/>
            <br/>
            { errors.email?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.email.message}</span>
                </div>
              </div>
            }
          <br/>
          <button type="submit" className="btn btn-secondary">更新する</button>

        </div>
      </form>
      
      <div className="form-foot-btns">
        <button type="submit" onClick={closeModal} className="btn btn-secondary">閉じる</button>
      </div>

    </div>
  )
}
