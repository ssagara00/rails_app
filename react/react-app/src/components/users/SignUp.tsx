import React from "react"
import { useForm } from 'react-hook-form'

import { signUp } from "../../api/auth"
import { SignUpParams } from "../../interfaces/user_interface"

interface SignUpProps {
  signup: boolean
  setSignup: Function
}

export const SignUp = ({ signup, setSignup }: SignUpProps) => {
  const { register, handleSubmit, getValues, trigger, formState: { errors } } = useForm<SignUpParams>({mode: "onBlur"});

    const closeModal = () => {
      setSignup(false);
    }

    const onSubmit = async(data: SignUpParams) =>{

      try {
        const res = await signUp(data);
        if (res.status === 200) {
          console.log("Signed up successfully!")
          setSignup(false);
        } else {
          console.log('signup is failed')
        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div>
      <h3 className="font-bold text-lg">SignUp!</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p className="py-4">name</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('name', {
              required: {
                value: true,
                message: '入力が必須の項目です。',
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

          <p className="py-4">email</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('email', {
              required: {
                value: true,
                message: '入力が必須の項目です。',
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

          <p className="py-4">password</p>
          <input type="password" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('password', {
              required: {
                value: true,
                message: '入力が必須の項目です。',
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

          <p className="py-4">passwordConfirmation</p>
          <input type="password" placeholder="Type here" className="input input-bordered w-full max-w-xs"
            {...register('passwordConfirmation', {
              required: {
                value: true,
                message: '入力が必須の項目です。',
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
          <input className="btn" type="submit" value="AddUser"/>
        </form>
        <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }

export default SignUp
