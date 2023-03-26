import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';

import { AuthContext } from "../../App";
import { deletePost, showUser, createLike, showLike, searchLike, deleteLike } from '../../api/api_actions';

import Update from './Update';
import Detail from './Detail';
import ReplyCreate from './ReplyCreate';
import { Dialog, DialogProps } from '../../Dialog';

import { Post, User, Like } from '../../interfaces/interface';

import hearton from '../../img/hearton.svg';
import heartoff from '../../img/heartoff.svg';
import noimage from '../../img/noimage.svg';

interface PostItemProps {
  post: Post
  setPosts: Function
}

  export const Item = ({ post, setPosts }: PostItemProps) => {
    const { isSignedIn, currentUser, loading, setCurrentUser, setLoading }= useContext(AuthContext);
    const user_id = currentUser?.id || 0;

    const alert = useAlert();
    const { handleSubmit } = useForm<Like>();
    const [dialog, setDialog] = useState<DialogProps | undefined>();
    const [detail, setDetail] = useState(false);
    const [update, setUpdate] = useState(false);
    const [reply, setReply] = useState(false);
    const [modalid, setModalid] = useState<number>(0);
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [user, setUser] = useState<User>();
    const [likes, setLikes] = useState<Like[]>([]);
    const [is_liked, setIs_liked] = useState(false);

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
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: '投稿削除',
        message: '削除します。よろしいですか?'
        });
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await deletePost(id);
          if (res?.status === 200) {
            alert.success('削除に成功しました');
            setPosts((prev: Post[]) => prev.filter((post: Post) => post.id !== id));
            setLoading(true);
          } else {
            alert.error('削除に失敗しました');
            console.log("Failed delete");
          }
        } catch (err) {
          alert.error('削除に失敗しました');
          console.log(err);
        }
      }
    }

    const handleGetUser = async () => {
      const id: number = post.user_id || 0;
      try {
        const res = await showUser(id);
        if (res?.status === 200) {
          setUser(res.data);
          setLoading(false);
        }
      } catch (err) {
        // ユーザーが退会済の時
        console.log(err);
      }
    }

    // 各投稿のいいね数を取得
    const handleGetLikeTotalNumber = async () => {
      const id: number = post.id || 0;
      try {
        const res = await showLike(id);
        if (res?.status === 200) {
          setLikes(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    // ログインユーザーがいいねした投稿を取得
    const handleGetMyLikes = async () => {
      const post_id: number = post.id || 0;
      try {
        const res = await searchLike(user_id,post_id);
        if (res?.status === 200) {
          setIs_liked(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const onlikeSubmit = async() =>{
      const formData :any = new FormData();
      formData.append("like[user_id]", user_id);
      formData.append("like[post_id]", post.id || 0);

      try {
        const res = await createLike(formData);
        if (res?.status === 200) {
          const id: number = post.id || 0;
          const result = await showLike(id);
          setLikes(result.data);
          setIs_liked(true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const onunlikeSubmit = async() =>{
      const post_id: number = post.id || 0
      try {
        const res = await deleteLike(user_id,post_id);
        if (res?.status === 200) {
          const id: number = post.id || 0;
          const res = await showLike(id);
          setLikes(res.data);
          setIs_liked(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(() => {
      handleGetUser();
    }, [loading]);

    useEffect(() => {
      handleGetLikeTotalNumber();
    }, [loading]);

    useEffect(() => {
      handleGetMyLikes();
    }, [setCurrentUser, loading]);

    return (
      <li>

        {dialog && <Dialog {...dialog} />}

        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="contentsheader">
            <p>投稿者：{user?.name}</p>
            <p>いいね数：{Object.keys(likes).length}</p>
          </div>

          {
            isSignedIn ? (

              is_liked == true ? (
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

          <figure className="imageclass">
          { 
            post.image?.url ?
            <img src={post.image.url} alt="post_image" width="200" height="200" className="rounded-xl"/>
             : 
            <img src={noimage}  alt="Shoes" className="rounded-xl" />
          }
          </figure>

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
              <button className="btn" onClick={() => detailstart(post.id || 0)}>詳細</button>
              <Modal isOpen={detail} className="Modal">
                <Detail detail={detail} setDetail={setDetail} modalid={modalid}/>
              </Modal>
              {
                isSignedIn && post.user_id == user_id &&

                <div className="card-actions">
                  <button className="btn" onClick={() => updatestart(post.id || 0,post.title,post.contents)}>更新</button>
                  <Modal isOpen={update} className="Modal">
                    <Update update={update} setUpdate={setUpdate} modalid={modalid} idtitle={title} idcontents={contents} post={post} setPosts={setPosts}/>
                  </Modal>

                  <button className="btn" onClick={() => handleDeletePost(post.id || 0)}>削除</button>
                </div>
              }

              {
                isSignedIn &&

                <div className="card-actions">
                  <button className="btn" onClick={() => replystart(post.id || 0,post.title)}>返信</button>
                  <Modal isOpen={reply} className="Modal">
                    <ReplyCreate reply={reply} setReply={setReply} modalid={modalid} idtitle={title} />
                  </Modal>
                </div>
              }

            </div>

          </div>
        </div>
      </li>
    )
  }

export default Item
