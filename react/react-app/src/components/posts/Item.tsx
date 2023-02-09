import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { useForm } from 'react-hook-form'

import { AuthContext } from "../../App";

import { User } from '../../interfaces/user_interface';
import { showUser } from '../../api/users';

import { Post } from '../../interfaces/interface';
import { deletePost } from '../../api/posts';

import { Like } from '../../interfaces/like_interface';
import { createLike, showLike, searchLike, deleteLike } from '../../api/likes';

import Update from './Update';
//import Detail from './Detail';
import ReplyCreate from './ReplyCreate';

import hearton from '../../img/hearton.svg';
import heartoff from '../../img/heartoff.svg';

interface PostItemProps {
  post: Post
  setPosts: Function
}

  export const Item = ({ post, setPosts }: PostItemProps) => {
    const { handleSubmit } = useForm<Like>();
    const [detail, setDetail] = useState(false);
    const [update, setUpdate] = useState(false);
    const [reply, setReply] = useState(false);
    const [modalid, setModalid] = useState<number>(0);
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [user, setUser] = useState<User>();
    const [likes, setLikes] = useState<Like[]>([]);
    const [my_liked, setMy_liked] = useState(false);

    const { loading, isSignedIn, currentUser, setCurrentUser, setIsSignedIn }= useContext(AuthContext);

    const detailstart = (id: number) =>{
      setDetail(true);
      setModalid(id);
    }

    const updatestart = (id: number, title:string, contents:string) =>{
      setUpdate(true);
      setModalid(id);
      setTitle(title);
      setContents(contents);
    }

    const replystart = (id: number, title:string) =>{
      setReply(true);
      setModalid(id);
      setTitle(title);
    }

    const handleDeletePost = async (id: number) => {
      try {
        const res = await deletePost(id)
        if (res?.status === 200) {
          setPosts((prev: Post[]) => prev.filter((post: Post) => post.id !== id))
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleGetUser = async () => {
      const id: number = post.user_id || 0
      try {
        const res = await showUser(id);
        if (res?.status === 200) {
          setUser(res.data);
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleShowLike = async () => {
      const id: number = post.id || 0
      try {
        const res = await showLike(id)
        if (res?.status === 200) {
          setLikes(res.data);
        }
      } catch (err) {
        console.log(err)
      }
    }
const user_id = 2

    const handleSearch = async () => {
      const post_id: number = post.id || 0
      try {
        const res = await searchLike(user_id,post_id)
        if (res?.status === 200) {
          setMy_liked(res.data)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const onlikeSubmit = async() =>{
      const data: Like = {
        user_id: user_id,
        post_id: post.id || 0
      }

      try {
        const res = await createLike(data);
        if (res?.status === 200) {
          const id: number = post.id || 0
          const result = await showLike(id);
          setLikes(result.data);
          setMy_liked(true);
        }
      } catch (err) {
        console.log(err)
      }
    }

    const onunlikeSubmit = async() =>{
      const post_id: number = post.id || 0
      try {
        const res = await deleteLike(user_id,post_id);
        if (res?.status === 200) {
          const id: number = post.id || 0
          const res = await showLike(id);
          setLikes(res.data);
          setMy_liked(false);
        }
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      handleGetUser()
    }, []);

    useEffect(() => {
      handleShowLike()
    }, [])

    useEffect(() => {
      handleSearch()
    }, [isSignedIn, setPosts]);

    return (
      <li>
        <div className="card w-96 bg-base-100 shadow-xl">
          <p>投稿者：{user?.name}</p>
          <p>いいね数：{likes?.length}</p>

          {
            isSignedIn && currentUser?.id == post.user_id ? (

              my_liked == true ? (
                <div>
                  <p>click to like</p>
                  <form onSubmit={handleSubmit(onunlikeSubmit)}>
                    <input type="image" src={hearton} alt="hearton" className="heart" />
                  </form>
                </div>
              ) : (
                <div>
                  <p>click to like</p>
                  <form onSubmit={handleSubmit(onlikeSubmit)}>
                    <input type="image" src={heartoff} alt="heartoff" className="heart" />
                  </form>
                </div>
              )
            ) : (
              <img src={heartoff} className="heart" alt="heartoff" />
            )

          }

          <figure className="imageclass">
          { post.image?.url ?
            <img src={post.image.url} alt="post_image" width="200" height="200" className="rounded-xl"/> : <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
          }
          </figure>

          <div className="card-body items-center text-center">
            <h2 className="card-title">{post.title}</h2>
              {
                post.contents.length > 9 ? (
                  <p>{post.contents.substr( 0, 5)}...</p>
                ) : (
                  <p>{post.contents}</p>
                )
              }

                {
                  isSignedIn && currentUser?.id == post.user_id &&

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => updatestart(post.id || 0,post.title,post.contents)}>更新</button>
                    <Modal isOpen={update} className="Modal">
                      <Update update={update} setUpdate={setUpdate} modalid={modalid} idtitle={title} idcontents={contents} post={post} setPosts={setPosts}/>
                    </Modal>

                    <button className="btn btn-secondary" onClick={() => handleDeletePost(post.id || 0)}>削除</button>
                  </div>

                }

                {
                  isSignedIn &&
<p>coming soon</p>
                  /*<div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => replystart(post.id || 0,post.title)}>返信</button>
                    <Modal isOpen={reply} className="Modal">
                      <ReplyCreate reply={reply} setReply={setReply} modalid={modalid} idtitle={title} />
                    </Modal>
                  </div>*/
                }

                  {/*<div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => detailstart(post.id || 0)}>詳細</button>
                    <Modal isOpen={detail} className="Modal">
                      <Detail detail={detail} setDetail={setDetail} modalid={modalid}/>
                    </Modal>
                  </div>*/}
          </div>
        </div>
      </li>
    )
  }

export default Item
