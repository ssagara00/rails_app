import React, { useEffect, useState } from 'react';

import { Post } from '../../interfaces/interface';
import { updatePost } from '../../api/posts';

import '../../App.css';

interface PostUpdateProps {
  update: boolean
  setUpdate: Function
  modalid: number
  idtitle: string
  idcontents: string
  posts: Post[]
  setPosts: Function
}

  export const Update = ({ update, setUpdate, modalid, idtitle, idcontents, posts, setPosts }: PostUpdateProps) => {
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [user_id, setUser_id] = useState<number>(2);

    const copy = posts.slice();

    useEffect(() => {
      setTitle(idtitle);setContents(idcontents)
    }, [idtitle,idcontents])

    if(update){
      const closeModal = () => {
        setUpdate(false)
      }

      const handleChangeTitle = (e) => {
        setTitle(e.target.value);
      };

      const handleChangeContents = (e) => {
        setContents(e.target.value);
      };

      const handleUpdatePost = async (e) => {
        e.preventDefault();

        const data: Post = {
          title: title,
          contents: contents
        };

        try {
          const res = await updatePost(modalid,data)
          if (res.status == 200) {
            const index = copy.findIndex(post => post["id"] === modalid);
            copy.splice(index,1,res.data);
            setPosts(copy);
            setUpdate(false);
          } else {
            console.log(res.data.message)
          }
        } catch (err) {
          console.log(err)
        }
      }

      return(
        <div>
          <h3 className="font-bold text-lg">NEW Posts!</h3>
            <form onSubmit={handleUpdatePost}>
              <p className="py-4">title</p>
              <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={title} onChange={handleChangeTitle}/>
              <p className="py-4">contents</p>
              <textarea className="textarea textarea-bordered" placeholder="Bio" value={contents} onChange={handleChangeContents}></textarea>
              <br/>
              <input className="btn" type="submit" value="Update"/>
            </form>
            <br/>
            <button onClick={closeModal} className="btn">Close Modal</button>
        </div>
      )
    }
  }

export default Update;
