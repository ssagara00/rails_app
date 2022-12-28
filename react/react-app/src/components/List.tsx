import React, { useState } from "react";
import Update from '../components/UpForm';
import Detail from '../components/Detail';
import { deletePost } from '../api/posts';

interface PostListProps {
  posts: Post[]
  setPosts: Function
}

export const PostList = ({ posts, setPosts }: PostListProps) => {
  const [show, setShow] = useState(false);
  const [upshow, setupShow] = useState(false);
  const [modalSelect, setModalSelect] = useState("");
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  const modalstart = (id: number) =>{
    setShow(true);
    setModalSelect(id);
  }

  const formstart = (id: number, title:string, contents:string) =>{
    setupShow(true);
    setModalSelect(id);
    setTitle(title);
    setContents(contents);
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

  return (
    <table>
      <thead>
        <tr>
          <th>投稿</th>
        </tr>
      </thead>
      <tbody>
              {
                posts.map((post: Post, index: number) => (
                  <tr key={index}>
                    <th>{post.title}</th>
                    <th>{post.contents}</th>
                    <th>
      <button onClick={() => formstart(post.id,post.title,post.contents)}>更新</button>
      <Update upshow={upshow} setupShow={setupShow} modalid={modalSelect} idtitle={title} idcontents={contents} posts={posts} setPosts={setPosts}/>

      <button onClick={() => handleDeletePost(post.id)}>削除</button>

      <button onClick={() => modalstart(post.id)}>詳細</button>
      <Detail show={show} setShow={setShow} modalid={modalSelect}/>
                    </th>
                  </tr>
                  )
                )
              }
      </tbody>
    </table>
  )
}
