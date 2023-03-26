import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useAlert } from 'react-alert'

import { AuthContext } from "../../App"
import { getIndexPosts, createPost } from '../../api/api_actions'

import { Dialog, DialogProps } from '../../Dialog'

import { Post } from '../../interfaces/interface'

interface PostFormProps {
  form: boolean
  setForm: Function
  posts: Post[]
  setPosts: Function
  resetoffset: boolean
  setResetoffset: Function
}

  export const Form = ({ form, setForm, posts, setPosts, resetoffset, setResetoffset }: PostFormProps) => {
    const { currentUser, setLoading }= useContext(AuthContext);
    const user_id = currentUser?.id;

    const alert = useAlert();
    const { register, handleSubmit, formState: { errors },} = useForm<Post>();
    const [dialog, setDialog] = useState<DialogProps | undefined>();

    const [isFileTypeError, setIsFileTypeError] = useState(false);
    const [photo, setPhoto] = useState<File>();
    const [preview, setPreview] = useState<string>("");

    const closeModal = () => {
      setForm(false);
    }

    const emptytarget: React.MouseEventHandler<HTMLInputElement> = (event) => {
      event.currentTarget.value = ''
    }

    const handleFile: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
      if ((event!.target! as HTMLInputElement).files === null || (event!.target! as HTMLInputElement).files!.length === 0) {
        return;
      }
      setIsFileTypeError(false);

      const file = (event!.target! as HTMLInputElement).files![0];
      if (
        ![
          "image/jpeg",
          "image/png",
          "image/bmp",
          "image/svg+xml",
        ].includes(file.type)
      ) {
        setIsFileTypeError(true);
        return false;
      }

      setPhoto(file);
      setPreview(window.URL.createObjectURL(file));
      return true;
    }

    const onSubmit = async(data: Post) =>{
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: '投稿',
        message: '投稿します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        const formData:any = new FormData();
        formData.append("post[user_id]", user_id);
        formData.append("post[title]", data.title);
        formData.append("post[contents]", data.contents);
        if (photo) formData.append("post[image]", photo);

        try {
          const res = await createPost(formData);
          if (res.status == 200) {
            const listres = await getIndexPosts(10,0);
            if (listres?.status === 200) {
              setPosts(listres.data);
            }
            alert.success('投稿に成功しました');
            setLoading(true);
            setResetoffset(true);
            setForm(false);
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

    const canselFile = () => {
      setIsFileTypeError(false);
      setPhoto(undefined);
      setPreview("");
    }

    return(
      <div>

        {dialog && <Dialog {...dialog} />}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className="head bg-neutral">
              <h2>POST FORM</h2>
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

              <p className="form-title">Image Uploade</p>
                <label className="btn btn-secondary">
                  file uploade!!
                  <input hidden type="file" data-testid="fileDropzone" id="photo" name="photo" accept="image/*,.png,.jpg,.jpeg,.gif" onChange={handleFile} onClick={emptytarget}/>
                </label>

              {
                isFileTypeError && (
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>※jpeg, png, bmp, svg以外のファイル形式は表示されません。</span>
                  </div>
                </div>
              )}
                
                <br/>

                {
                  preview ? (
                    <div>
                      <p className="form-title">投稿画像イメージ</p>
                      <img src={preview} alt="preview img" />
                    </div>
                  ) : (
                    null
                  )
                }
              <br/>
              <button className="btn btn-secondary" type="submit">POST!</button>

          </div>
        </form>

        <div className="footbtns">
          <button onClick={canselFile} className="btn btn-secondary">Cancel File</button>
          <button onClick={closeModal} className="btn btn-secondary">Close Modal</button>
        </div>

      </div>
    )
  }

export default Form;
