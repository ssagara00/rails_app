import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { useAlert } from 'react-alert';

import { AuthContext } from "../../App";
import { deleteReply } from '../../api/replies';
import { showUser } from '../../api/users';

import ReplyUpdate from './ReplyUpdate';
import { Dialog, DialogProps } from '../../Dialog';

import { Reply } from '../../interfaces/reply_interface';
import { User } from '../../interfaces/user_interface';

interface ReplyItemProps {
  reply: Reply
  setReply: Function
}

  export const ReplyItem = ({ reply, setReply }: ReplyItemProps) => {
    const { isSignedIn, currentUser }= useContext(AuthContext);

    const alert = useAlert();
    const [dialog, setDialog] = useState<DialogProps | undefined>();
    const [replyupdate, setReplyUpdate] = useState(false);
    const [modalid, setModalid] = useState<number>(0);
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [user, setUser] = useState<User>();

    const updatestart = (id: number, title:string, contents:string) =>{
      setReplyUpdate(true);
      setModalid(id);
      setTitle(title);
      setContents(contents);
    }

    const handleDeleteReply = async (id: number) => {
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: '投稿削除',
        message: '削除します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await deleteReply(id)
          if (res?.status === 200) {
            alert.success('削除に成功しました');
            setReply((prev: Reply[]) => prev.filter((reply: Reply) => reply.id !== id))
          } else {
            alert.error('削除に失敗しました');
            console.log("Failed delete");
          }
        } catch (err) {
          alert.error('削除に失敗しました');
          console.log(err)
        }
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
      handleGetUser();
    }, []);

    return (
      <li className="comment">

        {dialog && <Dialog {...dialog} />}

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
