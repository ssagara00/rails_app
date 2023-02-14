import React, { useContext } from 'react';
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
    const { register, handleSubmit, formState: { errors }, } = useForm<Reply>({ defaultValues: { title: 'Re:' + idtitle } });
    const { currentUser } = useContext(AuthContext);
    const user_id = currentUser?.id;
    
    const closeModal = () => {
      setReply(false)
    }

    const onSubmit = async(data: Reply) =>{

      const datas: Reply = {
        user_id: user_id,
        title: data.title,
        contents: data.contents,
        reply_from_id: modalid
      };

      try {
        const res = await createReply(datas)
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
          <input type="text" placeholder="Type title here" className="input input-bordered w-full max-w-xs"
            {...register('title', {
              required: 'タイトルを入力してください。'
            })}/>
            {errors.title?.type === 'required' && (
              <div>{errors.title.message}</div>
            )}

          <p className="py-4">contents</p>
          <input type="text" placeholder="Type contents here" className="input input-bordered w-full max-w-xs"
            {...register('contents', {
              required: '本文を入力してください。'
            })}/>
            {errors.contents?.type === 'required' && (
              <div>{errors.contents.message}</div>
            )}

          <br/>
          <button className="btn" type="submit">Reply!</button>
        </form>
        <br/>
        <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }

export default ReplyCreate;
