import React from 'react';
import { useForm } from 'react-hook-form';

import { Reply } from '../../interfaces/reply_interface';
import { updateReply } from '../../api/replies';

interface ReplyUpdateProps {
  replyupdate: boolean
  setReplyUpdate: Function
  modalid: number
  idtitle: string
  idcontents: string
  reply: Reply
  setReply: Function
}

  export const ReplyUpdate = ({ replyupdate, setReplyUpdate, modalid, idtitle, idcontents, reply, setReply }: ReplyUpdateProps) => {
    const { register, handleSubmit,formState: { errors }, } = useForm<Reply>({ defaultValues: { title: idtitle, contents: idcontents } });

    /*const copy = reply.slice();*/

    const closeModal = () => {
      setReplyUpdate(false)
    }

    const onSubmit = async(datas: Reply) =>{

      const data: Reply = {
        title: datas.title,
        contents: datas.contents
      };

      try {
        const res = await updateReply(modalid,data)
        if (res.status == 200) {
          /*const index = copy.findIndex(sreply => sreply["id"] === modalid);
          copy.splice(index,1,res.data);
          setsReply(copy);*/
          setReply((prev: Reply[]) => prev.map((value) => (value.id == modalid ?  res.data : value)));
          setReplyUpdate(false);
        } else {
          console.log(res.data.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    return(
      <div>
        <h3 className="font-bold text-lg">Update Posts!</h3>
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
          <button className="btn" type="submit">ReplyUpdate</button>
        </form>
        <br/>
        <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }

export default ReplyUpdate;
