import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'
import Modal from 'react-modal'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { deletePost, showUser, createLike, showLike, searchLike, deleteLike } from '../../api/api_actions'
import { Post, User, Like } from '../../interfaces/interface'
import { Update } from './Update'
import { Detail } from './Detail'
import { ReplyForm } from './ReplyForm'
import hearton from '../../img/hearton.svg'
import heartoff from '../../img/heartoff.svg'
import noimage from '../../img/noimage.svg'

interface PostItemProps {
  post: Post
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

export const Item = ({ post, setPosts}: PostItemProps) => {
  const { isSignedIn, currentUser }= useContext(AuthContext)
  const user_id = currentUser?.id
  const post_id = post.id

  const alert = useAlert()
  const { handleSubmit } = useForm<Like>()
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  const [detail, setDetail] = useState<boolean>(false)
  const [update, setUpdate] = useState<boolean>(false)
  const [replyForm, setReplyForm] = useState<boolean>(false)
  const [user, setUser] = useState<User>()
  const [is_liked, setIs_liked] = useState<boolean>(false)
  const [likes, setLikes] = useState<Like[]>([])
  const [reset, setReset] = useState<boolean>(false)

  const detailstart = () =>{
    setDetail(true)
  }

  const updatestart = () =>{
    setUpdate(true)
  }

  const replystart = () =>{
    setReplyForm(true)
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
            // ユーザー情報といいね状況を取得しなおす
            setReset(true)
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

  // 各投稿のいいね数を取得
  const handleGetLikeTotalNumber = async (id: number | undefined) => {
    if(id) {
      try {
        const res = await showLike(id)
        if (res.status === 200) {
          setLikes(res.data)
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('There is no target')
    }
  }

  // ログインユーザーがいいねした投稿を取得
  const handleGetMyLikes = async (user_target_id: number | undefined, post_target_id: number | undefined) => {
    if(user_target_id && post_target_id) {
      try {
        const res = await searchLike(user_target_id, post_target_id)
        if (res.status === 200) {
          setIs_liked(res.data)
        }
      } catch (err) {
        console.log(err)
      }
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
      console.log('You have to Sign In')
    }
  }

  // 詳細画面から削除した時、正しい投稿者情報を反映するため、詳細画面起動の変数を指定
  useEffect(() => {
    handleGetUser(post.user_id)
  }, [detail, reset])

  // 詳細画面からいいねを変更した時に状態を反映させるため、詳細画面起動の変数を指定
  useEffect(() => {
    handleGetLikeTotalNumber(post_id)
  }, [detail, reset])

  // 詳細画面からいいねを変更した時に状態を反映させるため、詳細画面起動の変数を指定
  useEffect(() => {
    handleGetMyLikes(user_id, post_id)
  }, [currentUser, detail, reset])

  return (
    <li>

      { dialog && <Dialog {...dialog} /> }

      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="contentsheader">
          {
            user ?
              <p>投稿者：{user.name}</p> : <p>投稿者：undefinedUSer</p>
          }
          <p>いいね数：{Object.keys(likes).length}</p>
        </div>

        {
          isSignedIn ? (

            is_liked === true ? (
              <form onSubmit={handleSubmit(onunlikeSubmit)}>
                <button type='submit' data-testid='tounlike'><img src={hearton} className="heart" alt="hearton" /></button>
              </form>
            ) : (
              <form data-testid='tet' onSubmit={handleSubmit(onlikeSubmit)}>        
                <button type='submit' data-testid='tolike'><img src={heartoff} className="heart" alt="heartoff" /></button>
              </form>
            )
          ) : (
            <img src={heartoff} className="heart" alt="heartoff" />
          )
        }

        <div className="imageclass">
        { 
          post.image?.url ?
          <img src={post.image.url} alt="post_image" width="200" height="200" className="rounded-xl"/>
            : 
          <img src={noimage} alt="Shoes" className="rounded-xl" />
        }
        </div>

        <div className="card-body items-center text-center">
          <h2 className="card-title">{post.title}</h2>
          {
            post.contents.length > 30 ? (
              <p>{post.contents.substring( 0, 30)}...</p>
            ) : (
              <p>{post.contents}</p>
            )
          }

          <div className="card-actions">
            <button type="submit" className="btn" onClick={() => detailstart()}>詳細</button>
            <Modal isOpen={detail} className="Modal">
              <Detail detail={detail} setDetail={setDetail} post={post} setPosts={setPosts} is_liked={is_liked} setIs_liked={setIs_liked} likes={likes} setLikes={setLikes}/>
            </Modal>
            {
              isSignedIn && post.user_id === user_id &&

              <div className="card-actions">
                <button type="submit" className="btn" onClick={() => updatestart()}>更新</button>
                <Modal isOpen={update} className="Modal">
                  <Update update={update} setUpdate={setUpdate} post={post} setPosts={setPosts}/>
                </Modal>

                <button type="submit" className="btn" onClick={() => handleDeletePost(post_id)}>削除</button>
              </div>
            }

            {
              isSignedIn &&

              <div className="card-actions">
                <button type="submit" className="btn" onClick={() => replystart()}>返信</button>
                <Modal isOpen={replyForm} className="Modal">
                  <ReplyForm replyForm={replyForm} setReplyForm={setReplyForm} post={post} replies={[]} setReplies={undefined} />
                </Modal>
              </div>
            }

          </div>

        </div>
      </div>
    </li>
  )
}
