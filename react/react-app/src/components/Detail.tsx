import React, { useState } from 'react';
import '../App.css';
import { Post } from '../interfaces/interface';
import { showPost } from '../api/posts';

  export const Detail = ({show, setShow, modalid}:{show: any, setShow:any, modalid: number}) => {
    const [post, setPost] = useState<Post[]>([]);
    const closeModal = () => {
      setShow(false)
    }

    if(show){
        const handleShowPost = async (id: number) => {
          try {
            const res = await showPost(modalid)
            if (res?.status === 200) {
              setPost(res.data);
            }
          } catch (err) {
            console.log(err)
          }
        }

        handleShowPost(modalid)

        return(
            <div id="overlay">
              <div id="content">
              <p>これがモーダルウィンドウです。</p>
              <p>{post.contents}</p>
              <button onClick={closeModal}>close</button>
              </div>
            </div>
        )
    }
  }

  export default Detail;
