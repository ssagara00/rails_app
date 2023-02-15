/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";

import { AuthContext } from "../../App";

import { User } from '../../interfaces/user_interface';
import { showUser } from '../../api/users';

import { Reply } from '../../interfaces/reply_interface';
import { deleteReply } from '../../api/replies';

import ReplyUpdate from './ReplyUpdate';

interface ReplyItemProps {
  reply: Reply
  setReply: Function
}

  export const ReplyItem = ({ reply, setReply }: ReplyItemProps) => {
    const [replyupdate, setReplyUpdate] = useState(false);
    const [modalid, setModalid] = useState<number>(0);
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [user, setUser] = useState<User>();

    const { isSignedIn, currentUser }= useContext(AuthContext);

    const updatestart = (id: number, title:string, contents:string) =>{
      setReplyUpdate(true);
      setModalid(id);
      setTitle(title);
      setContents(contents);
    }

    const handleDeleteReply = async (id: number) => {
      try {
        const res = await deleteReply(id)
        if (res?.status === 200) {
          setReply((prev: Reply[]) => prev.filter((reply: Reply) => reply.id !== id))
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleGetUser = async () => {
      const id: number = reply.user_id || 0
      try {
        const res = await showUser(id)
        if (res?.status === 200) {
          setUser(res.data);
        }
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      handleGetUser()
    }, []);

    return (
      <li className="comment">
        <h2 className="comment-title">{reply.title}</h2>
          <p>投稿者：{user?.name}</p>
          {/*<figure className="px-10 pt-10">
          { reply.image?.url ?
            <img src={reply.image.url} alt="post_image" className="rounded-xl" /> : <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
          }
          </figure>*/}
   
          <p className="comment-contents">{reply.contents}</p>

            {
              isSignedIn && currentUser?.id == reply.user_id &&

              <div className="card-actions">
                <button className="btn btn-secondary" onClick={() => updatestart(reply.id || 0,reply.title,reply.contents)}>更新</button>
                <Modal isOpen={replyupdate} className="Modal">
                  <ReplyUpdate replyupdate={replyupdate} setReplyUpdate={setReplyUpdate} modalid={modalid} idtitle={title} idcontents={contents} reply={reply} setReply={setReply} />
                </Modal>

                <button className="btn btn-secondary" onClick={() => handleDeleteReply(reply.id || 0)}>削除</button>
              </div>

            }

      </li>
    )
  }

export default ReplyItem
