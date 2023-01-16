import React, { useState, useContext } from 'react';

import { Post } from '../../interfaces/interface';
import { createPost } from '../../api/posts';
import { AuthContext } from "../../App";

import '../../App.css';

interface PostFormProps {
  form: boolean
  setForm: Function
  posts: Post[]
  setPosts: Function
}

  export const Form = ({ form, setForm, posts, setPosts }: PostFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const { currentUser }= useContext(AuthContext);
    const user_id = currentUser.id;

    if(form){
      const closeModal = () => {
        setForm(false);
      }

      const handleChangeTitle = (e) => {
        setTitle(e.target.value);
      };

      const handleChangeContents = (e) => {
        setContents(e.target.value);
      };

      const handleCreatePost = async (e) => {
        e.preventDefault();

        const data: Post = {
          user_id: currentid,
          title: title,
          contents: contents
        };

        try {
          const res = await createPost(data)
          if (res.status == 200) {
            setPosts([res.data, ...posts])
            setForm(false);
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
          <form onSubmit={handleCreatePost}>
            <p className="py-4">title</p>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={title} onChange={handleChangeTitle}/>
            <p className="py-4">contents</p>
            <textarea className="textarea textarea-bordered" placeholder="Bio" value={contents} onChange={handleChangeContents}></textarea>
            <br/>
            <input className="btn" type="submit" value="Add"/>
          </form>
          <br/>
          <button onClick={closeModal} className="btn">Close Modal</button>
        </div>
      )
    }
  }

export default Form;
