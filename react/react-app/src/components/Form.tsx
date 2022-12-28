import React, { useState } from 'react';
import { createPost } from '../api/posts';
import { Post } from '../interfaces/interface';

interface PostFormProps {
  posts: Post[]
  setPosts: Function
}

  export const Form = ({ posts, setPosts }: PostFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [user_id, setUser_id] = useState<number>(2);

    const handleChangeTitle = (e) => {
      setTitle(e.target.value);
    };

    const handleChangeContents = (e) => {
      setContents(e.target.value);
    };

    const handleCreatePost = async (e) => {
      e.preventDefault();

      const data: Post = {
        user_id: user_id,
        title: title,
        contents: contents
      };

      try {
        const res = await createPost(data)
        if (res.status == 200) {
          setPosts([res.data, ...posts])
        } else {
          console.log(res.data.message)
        }
      } catch (err) {
        console.log(err)
      }

      setTitle("")
      setContents("")
    }

    return(
<div>
      <p>ddd</p>
      <form onSubmit={handleCreatePost}>
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
      <input type="submit" value="Add"/>
    </form>
</div>
    );
  }

export default Form;
