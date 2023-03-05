import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { useNavigate, Link } from 'react-router-dom';
import Cookies from "js-cookie";

import { signOut } from "../../api/auth"
import { AuthContext } from "../../App";
import { deleteUser } from '../../api/users';

import editimage from '../../img/edit.svg';
import deleteaccount from '../../img/deleteaccount.svg';
import contents from '../../img/contents.svg';

import Edit from './Edit';
import Mylist from "./Mylist";

  export const AuthTop = () => {
    const navigation = useNavigate();
    const { currentUser, setIsSignedIn } = useContext(AuthContext);  
    const [edit, setEdit] = useState<boolean>(false);
    const [contents_flg, setContents_flg] = useState<boolean>(false);
    const user_id = currentUser?.id || 0;

    const editstart = () =>{
      setEdit(true);
    }

    const contentstart = () =>{
      setContents_flg(true);
    }

    const handleDeleteUser = async () => {
      try {
        const res = await deleteUser(user_id)
        if (res?.status === 200) {
          // const res = await signOut()
          if (res.data.success === true) {
            // サインアウト時には各Cookieを削除
            Cookies.remove("_access_token")
            Cookies.remove("_client")
            Cookies.remove("_uid")
            setIsSignedIn(false)
            navigation("/posts")
            console.log("Succeeded in sign out")
          } else {
            console.log("Failed in sign out")
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div>
      {
        contents_flg ? (
          <Mylist contents_flg={contents_flg} setContents_flg={setContents_flg} />
        ) : (
          <ul className="authlist">
            <li>
              <button onClick={() => editstart()}><img src={editimage} alt="user_edit" className="authmenu" width="200" height="200" /></button>
              <Modal isOpen={edit} className="Modal">
                <Edit edit={edit} setEdit={setEdit} />
              </Modal>
            </li>
            <li>
              <button onClick={() => handleDeleteUser()}><img src={deleteaccount} alt="deleteaccount" className="authmenu" width="200" height="200" /></button>
            </li>
            <li>
              <button onClick={() => contentstart()}><img src={contents} alt="contents" className="authmenu" width="200" height="200" /></button>
            </li>
          </ul>
        )
      }
      </div>
    )
  }

export default AuthTop
