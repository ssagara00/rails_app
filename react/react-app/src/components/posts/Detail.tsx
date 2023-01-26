import React, { useEffect, useState }  from 'react';

import { Post } from '../../interfaces/interface';
import { showPost } from '../../api/posts';
import { Reply } from '../../interfaces/reply_interface';
import { showReply } from '../../api/replies';

import ReplyItem from './ReplyItem';

import '../../App.css';

interface PostDetailProps {
  detail: boolean
  setDetail: Function
  modalid: number
}

  export const Detail = ({ detail, setDetail, modalid }: PostDetailProps) =>{
    const [post, setPost] = useState<Post[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);

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
      <div className="Detail_modals">
        <h3 className="font-bold text-lg">Detail</h3>

          <figure className="px-10 pt-10">
          { post.image?.url ?
            <img src={post.image.url} alt="post_image" className="rounded-xl" /> : <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
          }
          </figure>

          <h3>Title</h3>
          <p className="py-4">{post.title}</p>
          <h3>Contents</h3>
          <p className="py-4">{post.contents}</p>

          <br/>
          <button onClick={closeModal} className="btn">Close Modal</button>

        <h3 className="font-bold text-lg">Reply for this item</h3>

          <div className="collapse">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Click me to show/hide content
            </div>
            <div className="collapse-content">
              {
                replies.map((reply: Reply, index: number) => (
                  <ReplyItem key={index} reply={reply} setReplies={setReplies} />
                ))
              }
            </div>
          </div>
      </div>
    )
  }

export default Detail;
