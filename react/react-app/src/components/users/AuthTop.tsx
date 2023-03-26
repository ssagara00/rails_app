import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Cookies from "js-cookie";

import { AuthContext } from "../../App";
import { deleteUser } from "../../api/api_actions";

import Edit from './Edit';
import Mylist from "./Mylist";
import { Dialog, DialogProps } from '../../Dialog';

import editimage from '../../img/edit.svg';
import deleteaccount from '../../img/deleteaccount.svg';
import contents from '../../img/contents.svg';

  export const AuthTop = () => {
    const { currentUser, setIsSignedIn, setLoading } = useContext(AuthContext);
    const user_id = currentUser?.id || 0;

    const navigation = useNavigate();
    const alert = useAlert();
    const [dialog, setDialog] = useState<DialogProps | undefined>();
    const [edit, setEdit] = useState<boolean>(false);
    const [contents_flg, setContents_flg] = useState<boolean>(false);

    const editstart = () =>{
      setEdit(true);
    }

    const contentsStart = () =>{
      setContents_flg(true);
    }

    const handleDeleteUser = async () => {
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: 'ユーザー情報削除',
        message: '削除します。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await deleteUser(user_id);
          if (res?.status === 200) {
            Cookies.remove("_access_token");
            Cookies.remove("_client");
            Cookies.remove("_uid");
            setIsSignedIn(false);
            setLoading(true);
            navigation("/");
            alert.success('削除に成功しました');
            console.log("Succeeded in sign out");
          } else {
            alert.error('削除に失敗しました');
            console.log("Failed in sign out");
          }
        } catch (err) {
          alert.error('削除に失敗しました');
          console.log(err);
        }
      }
    }

    return (
      <div>

        {dialog && <Dialog {...dialog} />}

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
              <button onClick={() => contentsStart()}><img src={contents} alt="contents" className="authmenu" width="200" height="200" /></button>
            </li>
          </ul>
        )
      }
      </div>
    )
  }

export default AuthTop
