import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';

import { AuthContext } from "../../App";
import { createReply } from '../../api/api_actions';

import { Dialog, DialogProps } from '../../Dialog';

import { Reply } from '../../interfaces/interface';

interface PostReplyProps {
  reply: boolean
  setReply: Function
  modalid: number
  idtitle: string
}

  export const ReplyCreate = ({ reply, setReply, modalid, idtitle }: PostReplyProps) => {
    const { currentUser } = useContext(AuthContext);
    const user_id = currentUser?.id;
    
    const alert = useAlert();
    const { register, handleSubmit, formState: { errors }, } = useForm<Reply>({ defaultValues: { title: 'Re:' + idtitle } });
    const [dialog, setDialog] = useState<DialogProps | undefined>();
    
    const closeModal = () => {
      setReply(false);
    }

    const onSubmit = async(data: Reply) =>{
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: '投稿',
        message: '投稿します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        const formData :any = new FormData();
        formData.append("reply[user_id]", user_id);
        formData.append("reply[title]", data.title);
        formData.append("reply[contents]", data.contents);
        formData.append("reply[reply_from_id]", modalid);

        try {
          const res = await createReply(formData)
          if (res.status == 200) {
            alert.success('投稿に成功しました');
            setReply(false);
          } else {
            alert.error('投稿に失敗しました');
            console.log(res.data.message);
          }
        } catch (err) {
          alert.error('投稿に失敗しました');
          console.log(err);
        }
      }
    }

    return(
      <div>

        {dialog && <Dialog {...dialog} />}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className="head bg-neutral">
              <h2>REPLY FORM</h2>
            </div>

            <p className="form-title">Title</p>
            <input type="text" placeholder="Type title here" className="inputarea"
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

            <p className="form-title">Contents</p>
            <input type="text" placeholder="Type contents here" className="textfield"
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
            <button className="btn btn-secondary" type="submit">REPLY!</button>

          </div>
        </form>

        <div className="footbtns">
          <button onClick={closeModal} className="btn btn-secondary">Close Modal</button>
        </div>

      </div>
    )
  }

export default ReplyCreate;
