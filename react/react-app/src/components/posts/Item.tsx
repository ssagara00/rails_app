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
import Detail from './Detail';
import ReplyCreate from './ReplyCreate';

import hearton from '../../img/hearton.svg';
import heartoff from '../../img/heartoff.svg';

interface PostItemProps {
  post: Post[]
  setPosts: Function
}

  export const Item = ({ post, setPosts }: PostItemProps) => {
    const { handleSubmit } = useForm<Like>();
    const [detail, setDetail] = useState(false);
    const [update, setUpdate] = useState(false);
    const [reply, setReply] = useState(false);
    const [modalid, setModalid] = useState("");
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [user, setUser] = useState("");
    const [likes, setLikes] = useState<Like[]>([]);
    const [flg, setflg] = useState(false);

    const { isSignedIn, currentUser, setCurrentUser, SetIsSignedIn, IsSignedIn }= useContext(AuthContext);
    const user_id = currentUser.id

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

    const handleGetUser = async (id: number) => {
      try {
        const res = await showUser(post.user_id)
        if (res?.status === 200) {
          setUser(res.data);
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleShowLike = async (id: number) => {
      try {
        const res = await showLike(post.id)
        if (res?.status === 200) {
          setLikes(res.data);
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleSearch = async (user_id: number, post_id: number) => {
      try {
        const res = await searchLike(user_id,post.id)
        if (res?.status === 200) {
          setflg(res.data)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const onlikeSubmit = async() =>{
      const data: Like = {
        user_id: user_id,
        post_id: post.id
      }

      try {
        const res = await createLike(data);
        if (res?.status === 200) {
          const result = await showLike(post.id);
          setLikes(result.data);
          setflg(true);
        }
      } catch (err) {
        console.log(err)
      }
    }

    const onunlikeSubmit = async() =>{

      try {
        const res = await deleteLike(user_id,post.id);console.log(res);
        if (res?.status === 200) {
          const res = await showLike(post.id);
          setLikes(res.data);
          setflg(false);
        }
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      handleShowLike()
    }, [])

    useEffect(() => {
      handleGetUser()
    }, []);

    useEffect(() => {
      handleSearch(user_id,post.id)
    }, [isSignedIn, setPosts]);

    return (
      <div className="wrapper">
        <div className="card w-96 bg-base-100 shadow-xl">
          <p>投稿者：{user.name}</p>
          <p>いいね数：{likes.length}</p>

          {
            isSignedIn && currentUser.id == post.user_id ? (

              flg == true ? (
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

          <figure className="px-10 pt-10">
          { post.image?.url ?
            <img src={post.image.url} alt="post_image" className="rounded-xl" /> : <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
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
                  isSignedIn && currentUser.id == post.user_id &&

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => updatestart(post.id,post.title,post.contents)}>更新</button>
                    <Modal isOpen={update} className="Modal">
                      <Update update={update} setUpdate={setUpdate} modalid={modalid} idtitle={title} idcontents={contents} />
                    </Modal>

                    <button className="btn btn-secondary" onClick={() => handleDeletePost(post.id)}>削除</button>
                  </div>

                }

                {
                  isSignedIn &&

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => replystart(post.id,post.title)}>返信</button>
                    <Modal isOpen={reply} className="Modal">
                      <ReplyCreate reply={reply} setReply={setReply} modalid={modalid} idtitle={title} />
                    </Modal>
                  </div>
                }

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => detailstart(post.id)}>詳細</button>
                    <Modal isOpen={detail} className="Modal">
                      <Detail detail={detail} setDetail={setDetail} modalid={modalid}/>
                    </Modal>
                  </div>
          </div>
        </div>
      </div>
    )
  }

export default Item
