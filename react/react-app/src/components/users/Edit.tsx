import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';

import { AuthContext } from "../../App";
import { editUser } from '../../api/users';

import { Dialog, DialogProps } from '../../Dialog';

import { SignEditParams } from "../../interfaces/user_interface";

interface UserEditProps {
  edit: boolean
  setEdit: Function
}

  export const Edit = ({ edit, setEdit }: UserEditProps) => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const user_id = currentUser?.id || 0;
    const user_name = currentUser?.name;
    const user_mail = currentUser?.email;

    const alert = useAlert();
    const { register, handleSubmit, formState: { errors }  } = useForm<SignEditParams>({ defaultValues: { name: user_name, email: user_mail } });
    const [dialog, setDialog] = useState<DialogProps | undefined>();

    const closeModal = () => {
      setEdit(false);
    }

    const onSubmit = async(data: SignEditParams) =>{
      const ret = await new Promise<string>((resolve) => {
         setDialog({
         onClose: resolve,
         title: 'ユーザー情報編集',
         message: 'ユーザー情報を更新します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await editUser(user_id,data)
          if (res.status == 200) {
            alert.success('更新に成功しました');
            setCurrentUser(res.data.data);
            setEdit(false);
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
        
        <h3 className="font-bold text-lg">Update Your Information!</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p className="py-4">name</p>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
              {...register('name', {
                maxLength: {
                  value: 100,
                  message: '100文字以内で入力してください。',
                }
              })}/>
              { errors.name?.message &&
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{errors.name.message}</span>
                  </div>
                </div>
              }

            <p className="py-4">email</p>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
              {...register('email', {
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: 'メールアドレスの形式が不正です。',
                }
              })}/>
              { errors.email?.message &&
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{errors.email.message}</span>
                  </div>
                </div>
              }
          <br/>
          <button className="btn" type="submit">EDIT!</button>
        </form>
        <br/>
          <button onClick={closeModal} className="btn">Close Modal</button>
        <br/>

      </div>
    )
  }

export default Edit;
