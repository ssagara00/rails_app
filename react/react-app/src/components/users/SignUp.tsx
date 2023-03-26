import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';

import { signUp } from "../../api/api_actions";

import { Dialog, DialogProps } from '../../Dialog';

import { SignUpParams } from "../../interfaces/interface";

interface SignUpProps {
  signup: boolean
  setSignup: Function
}

  export const SignUp = ({ signup, setSignup }: SignUpProps) => {
    const alert = useAlert();
    const { register, handleSubmit, getValues, trigger, formState: { errors } } = useForm<SignUpParams>({mode: "onBlur"});
    const [dialog, setDialog] = useState<DialogProps | undefined>();

    const closeModal = () => {
      setSignup(false);
    }

    const onSubmit = async(data: SignUpParams) =>{
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: 'ユーザー登録',
        message: 'ユーザー登録します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await signUp(data);
          if (res.status === 200) {
            alert.success('登録に成功しました');
            console.log("Signed up successfully!");
            setSignup(false);
          } else {
            alert.error('登録に失敗しました');
            console.log('signup is failed');
          }
        } catch (err) {
          alert.error('登録に失敗しました');
          console.log(err);
        }
      }
    }

    return (
      <div>

        {dialog && <Dialog {...dialog} />}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className="head bg-neutral">
              <h2>SIGN UP</h2>
            </div>

            <p className="form-title">Name</p>
            <input type="text" placeholder="Type name here" className="inputarea"
              {...register('name', {
                required: {
                  value: true,
                  message: '名前を入力してください。',
                },
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

            <p className="form-title">Email</p>
            <input type="text" placeholder="Type email here" className="inputarea"
              {...register('email', {
                required: {
                  value: true,
                  message: 'メールアドレスを入力してください。',
                },
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

            <p className="form-title">Password</p>
            <input type="password" placeholder="Type password here" className="inputarea"
              {...register('password', {
                required: {
                  value: true,
                  message: 'パスワードを入力してください。',
                },
                minLength: {
                  value: 6,
                  message: '6文字以上入力してください。',
                },
                maxLength: {
                  value: 128,
                  message: '128文字以内で入力してください。',
                },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: 'パスワードは半角英数字のみ有効です。',
                },
                onBlur: () => {
                  if(getValues("passwordConfirmation")){
                    trigger("passwordConfirmation");
                  }
                }
              })}/>
              { errors.password?.message &&
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{errors.password.message}</span>
                  </div>
                </div>
              }

            <p className="form-title">PasswordConfirmation</p>
            <input type="password" placeholder="Type passwordconfirmation here" className="inputarea"
              {...register('passwordConfirmation', {
                required: {
                  value: true,
                  message: '確認用パスワードを入力してください。',
                },
                validate: (value)=> {
                  return (
                    value === getValues("password") || "パスワードが一致しません"
                  );
                }
              })}/>
              { errors.passwordConfirmation?.message &&
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{errors.passwordConfirmation.message}</span>
                  </div>
                </div>
              }
            <br/>
            <button className="btn btn-secondary" type="submit">SignUp</button>

          </div>
        </form>

        <div className="footbtns">
          <button onClick={closeModal} className="btn btn-secondary">Close Modal</button>
        </div>
      </div>
    )
  }

export default SignUp
