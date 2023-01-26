import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';

import { AuthContext } from "../../App";

import { Reply } from '../../interfaces/reply_interface';
import { createReply } from '../../api/replies';

import '../../App.css';

interface PostReplyProps {
  reply: boolean
  setReply: Function
  modalid: number
  idtitle: string
}

  export const ReplyCreate = ({ reply, setReply, modalid, idtitle }: PostReplyProps) => {
    const { currentUser }= useContext(AuthContext);
    const user_id = currentUser.id;
    const { register, handleSubmit,formState: { errors }, } = useForm<Post>({ defaultValues: { title: 'Re:' + idtitle } });

    const closeModal = () => {
      setReply(false)
    }

    const onSubmit = async(datas) =>{

      const data: Post = {
        user_id: user_id,
        title: datas.title,
        contents: datas.contents
      };

      try {
        const res = await createReply(modalid,data)
        if (res.status == 200) {
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
        <form onSubmit={handleSubmit(onSubmit)}>

          <p className="py-4">title</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('title', {
              required: '入力が必須の項目です。'
            })}/>
            {errors.title?.type === 'required' && (
              <div>{errors.title.message}</div>
            )}

          <p className="py-4">contents</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('contents', {
              required: '入力が必須の項目です。'
            })}/>
            {errors.contents?.type === 'required' && (
              <div>{errors.contents.message}</div>
            )}

          <br/>
          <button className="btn" type="submit">POST!</button>
        </form>
        <br/>
        <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }

export default ReplyCreate;
