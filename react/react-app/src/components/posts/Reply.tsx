import React, { useEffect, useState } from 'react';

import { Reply } from '../../interfaces/reply_interface';
import { createReply } from '../../api/replies';
import { AuthContext } from "../../App";

import '../../App.css';

interface PostReplyProps {
  reply: boolean
  setReply: Function
  modalid: number
  idtitle: string
  posts: Post[]
  setPosts: Function
}

  export const Replyx = ({ reply, setReply, modalid, idtitle, posts, setPosts }: PostReplyProps) => {
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const { currentUser }= useContext(AuthContext);
    const user_id = currentUser.id;

    useEffect(() => {
      setTitle('Re:' + idtitle)
    },[idtitle])

    if(reply){
      const closeModal = () => {
        setReply(false)
      }

      const handleChangeTitle = (e) => {
        setTitle(e.target.value);
      };

      const handleChangeContents = (e) => {
        setContents(e.target.value);
      };

      const handleReplyPost = async (e) => {
        e.preventDefault();

        const data: Post = {
          user_id: currentid,
          title: title,
          contents: contents,
          reply_from_id: modalid,
        };

        try {
          const res = await createReply(data);
          if (res.status == 200) {
            setreplies([res.data, ...replies])
            setReply(false);
          } else {
            console.log(res.data.message)
          }
        } catch (err) {
          console.log(err)
        }
      }

      return(
        <div>
          <h3 className="font-bold text-lg">NEW Reply!</h3>
            <form onSubmit={handleReplyPost}>
              <p className="py-4">title</p>
              <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={title} onChange={handleChangeTitle}/>
              <p className="py-4">contents</p>
              <textarea className="textarea textarea-bordered" placeholder="Bio" value={contents} onChange={handleChangeContents}></textarea>
              <br/>
              <input className="btn" type="submit" value="Reply"/>
            </form>
            <br/>
            <button onClick={closeModal} className="btn">Close Modal</button>
        </div>
      )
    }
  }

export default Replyx;
