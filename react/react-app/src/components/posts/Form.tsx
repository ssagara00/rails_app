import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { createPost } from '../../api/api_actions'
import { Post } from '../../interfaces/interface'

interface PostFormProps {
  form: boolean
  setForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const Form = ({ form, setForm }: PostFormProps) => {
  const { currentUser,setLoading }= useContext(AuthContext)
  const user_id = currentUser?.id
  
  const alert = useAlert()
  const { register, handleSubmit, formState: { errors } } = useForm<Post>()
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  const [isFileTypeError, setIsFileTypeError] = useState<boolean>(false)
  const [photo, setPhoto] = useState<File>()
  const [preview, setPreview] = useState<string>("")

  const closeModal = () => {
    setForm(false)
  }

  const emptytarget: React.MouseEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.value = ''
  }

  const handleFile: React.ChangeEventHandler<HTMLInputElement> = async(event) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return
    }
    setIsFileTypeError(false)

    const file = event.target.files[0]

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/bmp",
        "image/svg+xml",
      ].includes(file.type)
    ) {
      setIsFileTypeError(true)
      return
    }

    setPhoto(file)
    setPreview(window.URL.createObjectURL(file))
  }

  const onSubmit = async(data: Post) =>{
    const ret = await new Promise<string>((resolve) => {
      setDialog({
      onClose: resolve,
      title: '投稿',
      message: '投稿します。よろしいですか?'
      })
    })
    setDialog(undefined)

    if (ret === 'ok' && user_id ) {
      const formData = new FormData()
      formData.append("post[user_id]", user_id.toString())
      formData.append("post[title]", data.title)
      formData.append("post[contents]", data.contents)
      if (photo) formData.append("post[image]", photo)

      try {
        const res = await createPost(formData as any)
        if (res.status === 200) {
          alert.success('投稿に成功しました')
          setForm(false)
          setLoading(true)
        } else {
          alert.error('投稿に失敗しました')
          console.log(res.data.message)
        }
      } catch (err) {
        alert.error('投稿に失敗しました')
        console.log(err)
      }
    }
  }

  const canselFile = () => {
    setIsFileTypeError(false)
    setPhoto(undefined)
    setPreview("")
  }

  return(
    <div>

      {dialog && <Dialog {...dialog} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form">
          <div className="head bg-neutral">
            <h2>新規投稿</h2>
          </div>

          <p className="form-lead">タイトル</p>
          <input type="text" placeholder="Type title here" className="form-input"
            {...register('title', {
              required: {
                value: true,
                message: 'タイトルを入力してください。',
              },
              maxLength: {
                value: 30,
                message: '30文字以内で入力してください。',
              },
            })}/>
            { errors.title?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.title.message}</span>
                </div>
              </div>
            }

          <p className="form-lead">本文</p>
          <textarea placeholder="Type contents here" className="form-textarea" 
            {...register('contents', {
              required: {
                value: true,
                message: '本文を入力してください。',
              },
              maxLength: {
                value: 3000,
                message: '3000文字以内で入力してください。',
              },
            })}>
          </textarea>
            { errors.contents?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.contents.message}</span>
                </div>
              </div>
            }

          <p className="form-lead">画像</p>
          <label htmlFor="photo" className="btn btn-secondary">
            画像アップロード
            <input hidden type="file" data-testid="fileDropzone" id="photo" name="photo" accept="image/*,.png,.jpg,.jpeg,.gif" onChange={handleFile} onClick={emptytarget}/>
          </label>

          {
            isFileTypeError && (
            <div className="alert alert-warning shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>※jpeg, png, bmp, svg以外のファイル形式は表示されません。</span>
              </div>
            </div>
          )}
              
          <br/>
          {
            preview ? (
              <div className="form-img">
                <p className="form-lead">投稿画像イメージ</p>
                <img src={preview} alt="preview img" />
              </div>
            ) : (
              null
            )
          }
          <br/>
          <button className="btn btn-secondary" type="submit">投稿する</button>
          
        </div>
      </form>

      <div className="form-foot-btns">
        <button type="submit" onClick={canselFile} className="btn btn-secondary">画像リセット</button>
        <button type="submit" onClick={closeModal} className="btn btn-secondary">閉じる</button>
      </div>

    </div>
  )
}
