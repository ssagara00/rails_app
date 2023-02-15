/* eslint-disable */
import React, { useEffect, useState }  from 'react';

import { Post } from '../../interfaces/interface';
import { showPost } from '../../api/posts';
import { Reply } from '../../interfaces/reply_interface';
import { showReply } from '../../api/replies';

import ReplyItem from './ReplyItem';

interface PostDetailProps {
  detail: boolean
  setDetail: Function
  modalid: number
}

  export const Detail = ({ detail, setDetail, modalid }: PostDetailProps) =>{
    const [post, setPost] = useState<Post>();
    const [replies, setReplies] = useState<Reply[]>();

    const closeModal = () => {
      setDetail(false)
    }

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

    const handleShowReplies = async (id: number) => {
      try {
        const results = await showReply(modalid)
        if (results?.status === 200) {
          setReplies(results.data);
        }
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      handleShowPost(modalid)
    }, [])

    useEffect(() => {
      handleShowReplies(modalid)
    }, [])

    return(
      <div className="centor">

        <figure className="centor_image">
        { post?.image?.url ?
          <img src={post.image.url} alt="post_image" className="rounded-xl" /> : <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
        }
        </figure>

        <h3 className="topic">Title</h3>
        <p>{post?.title}</p>
        <h3 className="topic">Contents</h3>
        <p>{post?.contents}</p>
        <br/>
        <h3 className="topic">Reply for this item</h3>
          
          <ul>
            {
              replies?.map((reply: Reply, index: number) => (
                <ReplyItem key={index} reply={reply} setReply={setReplies} />
              ))
            }
          </ul>
        <br/>
        <button onClick={closeModal} className="btn">Close Modal</button> 
      </div>
    )
  }

export default Detail;
