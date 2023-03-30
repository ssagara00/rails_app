import React, { useState, useEffect, useContext } from 'react'
import { useAlert } from 'react-alert'
import Modal from 'react-modal'
import moment from 'moment'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { deleteReply, showUser } from '../../api/api_actions'
import { Reply, User } from '../../interfaces/interface'
import { ReplyUpdate } from './ReplyUpdate'

interface ReplyItemProps {
  reply: Reply
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>
}

export const ReplyItem = ({ reply, setReplies }: ReplyItemProps) => {
  const { isSignedIn, currentUser } = useContext(AuthContext)

  const alert = useAlert()
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  const [replyupdate, setReplyUpdate] = useState<boolean>(false)
  const [user, setUser] = useState<User>()

  const updatestart = () =>{
    setReplyUpdate(true)
  }

  const handleDeleteReply = async (id: number) => {
    const ret = await new Promise<string>((resolve) => {
      setDialog({
      onClose: resolve,
      title: '投稿削除',
      message: '削除します。よろしいですか?'
      })
    })
    setDialog(undefined)

    if (ret === 'ok') {
      try {
        const res = await deleteReply(id)
        if (res.status === 200) {
          alert.success('削除に成功しました')
          // ユーザー情報を正確に取得するため、削除後の正しい投稿を即座に割り当てる
          setReplies((prev: Reply[]) => prev.filter((prevreply: Reply) => prevreply.id !== id))
          if(reply.user_id){
            handleGetUser(reply.user_id)
          }
        } else {
          alert.error('削除に失敗しました')
          console.log("Failed delete")
        }
      } catch (err) {
        alert.error('削除に失敗しました')
        console.log(err)
      }
    }
  }

  const handleGetUser = async (id: number) => {
    try {
      const res = await showUser(id)
      if (res.status === 200) {
        setUser(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleGetUser(reply.user_id || 0)
  }, [])

  return (
    <li className="comment">

      {dialog && <Dialog {...dialog} />}

      <h2 className="comment-title">{reply.title}</h2>
        {
          user ?
            <p>投稿者：{user.name}</p> : <p>投稿者：undefinedUSer</p>
        }
        <p>投稿日：{moment(reply.created_at).format('YYYY-MM-DD')}</p>
        <p className="comment-contents">{reply.contents}</p>

        {
          isSignedIn && currentUser?.id === reply.user_id &&

          <div className="card-actions">
            <button type="submit" className="btn" onClick={() => updatestart()}>更新</button>
            <Modal isOpen={replyupdate} className="Modal">
              <ReplyUpdate replyupdate={replyupdate} setReplyUpdate={setReplyUpdate} reply={reply} setReplies={setReplies} />
            </Modal>

            <button type="submit" className="btn" onClick={() => handleDeleteReply(reply.id || 0)}>削除</button>
          </div>

        }

    </li>
  )
}
