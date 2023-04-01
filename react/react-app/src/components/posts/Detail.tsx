import React, { useEffect, useState, useContext }  from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'
import Modal from 'react-modal'
import moment from 'moment'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { deletePost, showReply, showUser, showLike, createLike, deleteLike } from '../../api/api_actions'
import { Post, Reply, User, Like } from '../../interfaces/interface'
import { Update } from './Update'
import { ReplyForm } from './ReplyForm'
import { ReplyItem } from './ReplyItem'
import hearton from '../../img/hearton.svg'
import heartoff from '../../img/heartoff.svg'
import noimage from '../../img/noimage.svg'

interface PostDetailProps {
  detail: boolean
  setDetail: React.Dispatch<React.SetStateAction<boolean>>
  post: Post
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  is_liked: boolean
  setIs_liked: React.Dispatch<React.SetStateAction<boolean>>
  likes: Like[]
  setLikes: React.Dispatch<React.SetStateAction<Like[]>>
}

export const Detail = ({ detail, setDetail, post, setPosts, is_liked, setIs_liked, likes, setLikes }: PostDetailProps) =>{
  const { isSignedIn, currentUser }= useContext(AuthContext)
  const user_id = currentUser?.id
  const post_id = post.id

  const alert = useAlert()
  const { handleSubmit } = useForm<Like>()
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  const [update, setUpdate] = useState<boolean>(false)
  const [replyForm, setReplyForm] = useState<boolean>(false)
  const [replies, setReplies] = useState<Reply[]>([])
  const [user, setUser] = useState<User>()

  const closeModal = () => {
    setDetail(false)
  }

  const updatestart = () =>{
    setUpdate(true)
  }

  const replystart = () =>{
    setReplyForm(true)
  }

  const handleShowReplies = async (id: number | undefined) => {
    if(id) {
      try {
        const res = await showReply(id)
        if (res.status === 200) {
          setReplies(res.data)
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('There is no target')
    }
  }

  const handleDeletePost = async (id: number | undefined) => {
    if(id) {
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
          const res = await deletePost(id)
          if (res.status === 200) {
            alert.success('削除に成功しました')
            // Likeテーブルの情報を正確に取得するため、削除後の正しい投稿を即座に割り当てる
            setPosts((prev: Post[]) => prev.filter((prevpost: Post) => prevpost.id !== id))
            setDetail(false)
          } else {
            alert.error('削除に失敗しました')
            console.log("Failed delete")
          }
        } catch (err) {
          alert.error('削除に失敗しました')
          console.log(err)
        }
      }
    } else {
      console.log('There is no target')
    }
  }

  const handleGetUser = async (id: number) => {
    try {
      const res = await showUser(id)
      if (res.status === 200) {
        setUser(res.data)
      }
    } catch (err) {
      // ユーザーが退会済の時
      console.log(err)
    }
  }

  const onlikeSubmit = async() =>{
    if(user_id && post_id) {
      const formData = new FormData()
      formData.append("like[user_id]", user_id.toString())
      formData.append("like[post_id]", post_id.toString())

      try {
        const res = await createLike(formData as any)
        if (res.status === 200) {
          const result = await showLike(post_id)
          setLikes(result.data)
          setIs_liked(true)
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('You have to Sign In Or There is no target')
    }
  }

  const onunlikeSubmit = async() =>{
    if(user_id && post_id) {
      try {
        const res = await deleteLike(user_id, post_id)
        if (res.status === 200) {
          const ret = await showLike(post_id)
          setLikes(ret.data)
          setIs_liked(false)
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('You have to Sign In Or There is no target')
    }
  }

  useEffect(() => {
    handleGetUser(post.user_id)
  }, [])

  useEffect(() => {
    handleShowReplies(post_id)
  }, [])

  return(
    <div className="centor">

      { dialog && <Dialog {...dialog} /> }

      <div className="contentsheader">
          {
            user ?
              <p>投稿者：{user.name}</p> : <p>投稿者：undefinedUSer</p>
          }
        <p>いいね数：{Object.keys(likes).length}</p>
      </div>

      <div className="contentsheader">
        <p>投稿日：{moment(post.created_at).format('YYYY-MM-DD')}</p>

        {
          isSignedIn ? (
            is_liked === true ? (
              <form onSubmit={handleSubmit(onunlikeSubmit)}>
                <button type='submit' data-testid='tounlike'><img src={hearton} className="heartindetail" alt="hearton" /></button>
              </form>
            ) : (
              <form data-testid='tet' onSubmit={handleSubmit(onlikeSubmit)}>        
                <button type='submit' data-testid='tolike'><img src={heartoff} className="heartindetail" alt="heartoff" /></button>
              </form>
            )
          ) : (
            <img src={heartoff} className="heartindetail" alt="heartoff" />
          )
        }
      </div>

      <div className="centor_image">
        { 
          post.image?.url ?
          <img src={post.image.url} alt="post_image" className="rounded-xl" /> : <img src={noimage} alt="Shoes" className="rounded-xl" />
        }
      </div>

      <h3 className="topic">タイトル</h3>
      <p>{post.title}</p>
      <h3 className="topic">本文</h3>
      <p>{post.contents}</p>
      <br/>

      <div className="card-actions">
        {
          isSignedIn && post.user_id === user_id &&

          <div className="card-actions">
            <button type="submit" className="btn" onClick={() => updatestart()}>更新</button>
            <Modal isOpen={update} className="Modal">
              <Update update={update} setUpdate={setUpdate} post={post} setPosts={setPosts} />
            </Modal>

            <button type="submit" className="btn" onClick={() => handleDeletePost(post.id || 0)}>削除</button>
          </div>
        }

        {
          isSignedIn &&

          <div className="card-actions">
            <button type="submit" className="btn" onClick={() => replystart()}>返信</button>
            <Modal isOpen={replyForm} className="Modal">
              <ReplyForm replyForm={replyForm} setReplyForm={setReplyForm} post={post} replies={replies} setReplies={setReplies} />
            </Modal>
          </div>
        }
      </div>

      <h3 className="topic">返信</h3>
        
        {
          replies.length  === 0 ? (
            <p>まだ返信がありません。</p>
          ) : (
            <ul>
              {
                replies.map((reply: Reply) => (
                  <ReplyItem key={reply.id} reply={reply} setReplies={setReplies} />
                ))
              }
            </ul>
          )
        }

      <br/>
      <button type="submit" onClick={closeModal} className="btn">閉じる</button> 

    </div>
  )
}