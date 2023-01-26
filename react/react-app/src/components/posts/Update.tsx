import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Post } from '../../interfaces/interface';
import { updatePost } from '../../api/posts';

import '../../App.css';

interface PostUpdateProps {
  update: boolean
  setUpdate: Function
  modalid: number
  idtitle: string
  idcontents: string
  post: Post[]
  setPosts: Function
}

  export const Update = ({ update, setUpdate, modalid, idtitle, idcontents, post, setPosts }: PostUpdateProps) => {
    const { register, handleSubmit,formState: { errors } } = useForm<Post>({ defaultValues: { title: idtitle, contents: idcontents } });
    const inputRef = useRef(null);
    const acceptImageFiles = ["image/png", "image/jpeg", "image/jpg"];

    const [isFileTypeError, setIsFileTypeError] = useState(false);
    const [photo, setPhoto] = useState<string>("");
    const [preview, setPreview] = useState<File[]>([]);

    const closeModal = () => {
      setUpdate(false)
    }

    const emptytarget = () => {
      event.target.value = '';
    }

    const handleFile = async() => {
      if (event.target.files === null || event.target.files.length === 0) {
        return;
      }
      setIsFileTypeError(false);

      const file = event.target.files[0];

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
      setPreview(window.URL.createObjectURL(file))
      return true;
    }

    const onSubmit = async(data) =>{

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("contents", data.contents);
      if (photo) formData.append("image", photo);

      try {
        const res = await updatePost(modalid,formData)
        if (res.status == 200) {
          setPosts((prev: Post[]) => prev.map((value) => (value.id == modalid ?  res.data : value)));
          setUpdate(false);
        } else {
          console.log(res.data.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const canselFile = () => {
      setIsFileTypeError(false);
      setPhoto('');
      setPreview('');
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

          <p>image uploade</p>
          <label className="btn">file uploade!!
            <input hidden type="file" ref={inputRef} id="photo" name="photo" accept={acceptImageFiles} onChange={handleFile} onClick={emptytarget}/>
          </label>
          <br/>
          <button className="btn" type="submit">POST!</button>
        </form>
        <br/>
        {isFileTypeError && (
          <p>※jpeg, png, bmp, svg以外のファイル形式は表示されません</p>
        )}
        <button onClick={canselFile} className="btn">cancelFile</button>
        <button onClick={closeModal} className="btn">Close Modal</button>
        <br/>

        { preview ? (
          <div>
            <p>preview</p>
            <img src={preview} alt="preview img" />
          </div>
        ) : null
        }

      </div>
    )
  }

export default Update;
