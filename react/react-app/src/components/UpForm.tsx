import React, { useEffect,useState } from 'react';
import { updatePost } from '../api/posts';
import { showPost } from '../api/posts';
import { Post } from '../interfaces/interface';
import '../App.css';

interface PostFormProps {
  posts: Post[]
  setPosts: Function
}

  export const Update = ({ upshow, setupShow, modalid, idtitle, idcontents, posts, setPosts }: PostFormProps) => {
    const [title, setTitle] = useState<string>(idtitle);
    const [contents, setContents] = useState<string>(idcontents);
    const [user_id, setUser_id] = useState<number>(2);
    const copy = posts.slice();
    const closeModal = () => {
      setupShow(false)
    }
    useEffect(()=>{setTitle(idtitle);setContents(idcontents)},[idtitle,idcontents]);

    if(upshow){
      const handleChangeTitle = (e) => {
        setTitle(e.target.value);
      };

      const handleChangeContents = (e) => {
        setContents(e.target.value);
      };

      const handleUpdatePost = async (e) => {
        e.preventDefault();

        const data: Post = {
          user_id: user_id,
          title: title,
          contents: contents
        };

        try {

          const res = await updatePost(modalid,data)
          if (res.status == 200) {
            const index = copy.findIndex(post => post["id"] === modalid);
            copy.splice(index,1,res.data);
            setPosts(copy);
            setupShow(false);
          } else {
            console.log(res.data.message)
          }
        } catch (err) {
          console.log(err)
        }
      }

      return(
        <div id="overlay">
          <div id="content">
              <p>ddd</p>
              <form onSubmit={handleUpdatePost}>
              <p>title</p>
              <input
                type="text"
                value={title}
                onChange={handleChangeTitle}
              />
              <p>contents</p>
              <input
                type="text"
                value={contents}
                onChange={handleChangeContents}
              />
              <input type="submit" value="Update"/>
            </form>
            <button onClick={closeModal}>close</button>
          </div>
        </div>
      );
    }
  }

export default Update;
