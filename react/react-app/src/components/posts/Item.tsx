import React, { useState, useContext } from "react";
import Modal from "react-modal";

import { AuthContext } from "../../App";

import { Post } from '../../interfaces/interface';
import { deletePost } from '../../api/posts';

import Update from './Update';
import Detail from './Detail';
import Replyx from './Reply';

interface PostItemProps {
  post: Post[]
  setPost: Function
}

  export const Item = ({ post, setPost }: PostItemProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [detail, setDetail] = useState(false);
    const [update, setUpdate] = useState(false);
    const [reply, setReply] = useState(false);
    const [modalid, setModalid] = useState("");
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    const { isSignedIn, currentUser }= useContext(AuthContext);

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
          setPost((prev: Post[]) => prev.filter((post: Post) => post.id !== id))
        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div className="wrapper">
        <div className="card w-96 bg-base-100 shadow-xl">
          <p>投稿者：</p>
          <figure className="px-10 pt-10">
            <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
          </figure>

          <div className="card-body items-center text-center">
            <h2 className="card-title">{post.title}</h2>
              <p>{post.contents}</p>

                {
                  /*isSignedIn && currentUser.id == post.user_id &&*/

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => updatestart(post.id,post.title,post.contents)}>更新</button>
                    <Modal isOpen={update} className="Modal">
                      <Update update={update} setUpdate={setUpdate} modalid={modalid} idtitle={title} idcontents={contents} posts={posts} setPosts={setPosts}/>
                    </Modal>

                    <button className="btn btn-secondary" onClick={() => handleDeletePost(post.id)}>削除</button>
                  </div>

                }

                {
                  isSignedIn &&

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => replystart(post.id,post.title)}>返信</button>
                    <Modal isOpen={reply} className="Modal">
                      <Replyx reply={reply} setReply={setReply} modalid={modalid} idtitle={title} posts={posts} setPosts={setPosts}/>
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
