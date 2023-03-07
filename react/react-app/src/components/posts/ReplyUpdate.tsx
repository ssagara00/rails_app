import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';

import { updateReply } from '../../api/replies';

import { Dialog, DialogProps } from '../../Dialog';

import { Reply } from '../../interfaces/reply_interface';


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
    const alert = useAlert();
    const { register, handleSubmit,formState: { errors }, } = useForm<Reply>({ defaultValues: { title: idtitle, contents: idcontents } });
    const [dialog, setDialog] = useState<DialogProps | undefined>();

    const closeModal = () => {
      setReplyUpdate(false)
    }

    const onSubmit = async(data: Reply) =>{
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: '投稿',
        message: '更新します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await updateReply(modalid,data)
          if (res.status == 200) {
            alert.success('更新に成功しました');
            setReply((prev: Reply[]) => prev.map((value) => (value.id == modalid ?  res.data : value)));
            setReplyUpdate(false);
          } else {
            alert.error('更新に失敗しました');
            console.log(res.data.message);
          }
        } catch (err) {
          alert.error('更新に失敗しました');
          console.log(err);
        }
      }
    }

    return(
      <div>

        {dialog && <Dialog {...dialog} />}

        <h3 className="font-bold text-lg">Update Posts!</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p className="py-4">title</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('title', {
              required: {
                value: true,
                message: 'タイトルを入力してください。',
              },
              maxLength: {
                value: 30,
                message: '30文字以内で入力してください。',
              },
            })}/>
            { errors.title?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.title.message}</span>
                </div>
              </div>
            }

          <p className="py-4">contents</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('contents', {
              required: {
                value: true,
                message: '本文を入力してください。',
              },
              maxLength: {
                value: 3000,
                message: '3000文字以内で入力してください。',
              },
            })}/>
            { errors.contents?.message &&
              <div className="alert alert-warning shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{errors.contents.message}</span>
                </div>
              </div>
            }

          <br/>
          <button className="btn" type="submit">ReplyUpdate</button>
        </form>
        <br/>
        <button onClick={closeModal} className="btn">Close Modal</button>
        
      </div>
    )
  }

export default ReplyUpdate;
