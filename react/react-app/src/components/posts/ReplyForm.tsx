import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { createReply } from '../../api/api_actions'
import { Post, Reply } from '../../interfaces/interface'

interface PostReplyProps {
  replyForm: boolean
  setReplyForm: React.Dispatch<React.SetStateAction<boolean>>
  post: Post
  replies?: Reply[] 
  setReplies?: React.Dispatch<React.SetStateAction<Reply[]>>
}

export const ReplyForm = ({ replyForm, setReplyForm, post, replies, setReplies }: PostReplyProps) => {
  const { currentUser } = useContext(AuthContext)
  const user_id = currentUser?.id
  const post_id = post.id
  
  const alert = useAlert()
  const { register, handleSubmit, formState: { errors }, } = useForm<Reply>({ defaultValues: { title: `Re:${post.title}` } })
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  
  const closeModal = () => {
    setReplyForm(false)
  }

  const onSubmit = async(data: Reply) =>{
    const ret = await new Promise<string>((resolve) => {
      setDialog({
      onClose: resolve,
      title: '返信',
      message: '返信します。よろしいですか?'
      })
    })
    setDialog(undefined)

    if (ret === 'ok' && user_id && post_id) {
      const formData = new FormData()
      formData.append("reply[user_id]", user_id.toString())
      formData.append("reply[title]", data.title)
      formData.append("reply[contents]", data.contents)
      formData.append("reply[reply_from_id]", post_id.toString())

      try {
        const res = await createReply(formData as any)
        if (res.status === 200) {
          alert.success('返信に成功しました')
          // 詳細画面から呼び出した場合は、返信内容即時反映のため、配列に新規投稿を追加。
          if(replies && setReplies ){
            setReplies([...replies, res.data])
          }
          setReplyForm(false)
        } else {
          alert.error('返信に失敗しました')
          console.log(res.data.message)
        }
      } catch (err) {
        alert.error('返信に失敗しました')
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
            <h2>返信</h2>
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
          <br/>
            { errors.contents?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.contents.message}</span>
                </div>
              </div>
            }
          <br/>
          <button type="submit" className="btn btn-secondary">返信する</button>
          
        </div>
      </form>

      <div className="form-foot-btns">
        <button type="submit" onClick={closeModal} className="btn btn-secondary">閉じる</button>
      </div>

    </div>
  )
}