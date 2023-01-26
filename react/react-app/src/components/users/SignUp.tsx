import React, { useState, useContext } from "react"
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"

import { signUp } from "../../api/auth"
import { SignUpParams } from "../../interfaces/user_interface"
import { AuthContext } from "../../App";

interface SignUpProps {
  signup: boolean
  setSignup: Function
}

export const SignUp = ({ signup, setSignup }: SignUpProps) => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { register, handleSubmit,formState: { errors }, } = useForm<SignInParams>();

    const closeModal = () => {
      setSignup(false);
    }

    const onSubmit = async(data) =>{

      const params: SignUpParams = {
        name: name,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation
      }

      try {
        const res = await signUp(params);
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
              required: '入力が必須の項目です。'
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
              required: '入力が必須の項目です。'
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
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" type="password"
            {...register('password', {
              required: {
                value: true,
                message: '入力が必須の項目です。',
              },
              minLength: {
                value: 7,
                message: '7文字以上入力してください。',
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'only english or number',
              },
            })}/>
            {errors.password?.type === 'required' && (
              <div>{errors.password.message}</div>
            )}
            {errors.password?.type === 'minLength' && (
              <div>{errors.password.message}</div>
            )}
            {errors.password?.type === 'pattern' && (
              <div>{errors.password.message}</div>
            )}

          <p className="py-4">passwordConfirmation</p>
          <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" type="passwordConfirmation"
            {...register('passwordConfirmation', {
              required: {
                value: true,
                message: '入力が必須の項目です。',
              },
              minLength: {
                value: 7,
                message: '7文字以上入力してください。',
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'only english or number',
              },
            })}/>
            {errors.passwordConfirmation?.type === 'required' && (
              <div>{errors.passwordConfirmation.message}</div>
            )}
            {errors.passwordConfirmation?.type === 'minLength' && (
              <div>{errors.passwordConfirmation.message}</div>
            )}
            {errors.passwordConfirmation?.type === 'pattern' && (
              <div>{errors.passwordConfirmation.message}</div>
            )}

          <br/>
          <input className="btn" type="submit" value="AddUser"/>
        </form>
        <button onClick={closeModal} className="btn">Close Modal</button>
      </div>
    )
  }

export default SignUp
