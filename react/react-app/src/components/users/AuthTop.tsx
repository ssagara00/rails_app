import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Modal from 'react-modal'
import Cookies from 'js-cookie'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { deleteUser } from '../../api/api_actions'
import { Edit } from './Edit'
import { Mylist } from './Mylist'
import editimage from '../../img/edit.svg'
import deleteaccount from '../../img/deleteaccount.svg'
import contents from '../../img/contents.svg'

export const AuthTop = () => {
  const { currentUser, setIsSignedIn } = useContext(AuthContext)
  const user_id = currentUser?.id

  const navigation = useNavigate()
  const alert = useAlert()
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  const [edit, setEdit] = useState<boolean>(false)
  const [contents_flg, setContents_flg] = useState<boolean>(false)

  const editstart = () =>{
    setEdit(true)
  }

  const contentsStart = () =>{
    setContents_flg(true)
  }

  const handleDeleteUser = async (id: number | undefined) => {
    if(id){
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: '退会',
        message: '退会します。よろしいですか?'
        })
      })
      setDialog(undefined)

      if (ret === 'ok' && id) {
        try {
          const res = await deleteUser(id)
          if (res.status === 200) {
            Cookies.remove("_access_token")
            Cookies.remove("_client")
            Cookies.remove("_uid")
            setIsSignedIn(false)
            navigation("/")
            alert.success('アカウントの削除に成功しました')
          } else {
            alert.error('アカウントの削除に失敗しました')
            console.log('Failed in delete User')
          }
        } catch (err) {
          alert.error('アカウントの削除に失敗しました')
          console.log(err)
        }
      }
    } else {
      console.log('You have to Sign In')
    }
  }

  return (
    <div>

      {dialog && <Dialog {...dialog} />}

    {
      contents_flg ? (
        <Mylist contents_flg={contents_flg} setContents_flg={setContents_flg} />
      ) : (
        <ul className="mypage-list">
          <li>
            <button type="submit" onClick={() => editstart()}><img src={editimage} alt="user_edit" className="mypage-icon" width="250" height="250" /></button>
            <Modal isOpen={edit} className="Modal">
              <Edit edit={edit} setEdit={setEdit} />
            </Modal>
              <div tabIndex={0} className="collapse collapse-arrow bg-base-100 rounded-box">
                <div className="collapse-title text-xl font-medium">
                  ユーザー情報編集
                </div>
                <div className="collapse-content"> 
                  <p>名前とメールアドレスを変更できます。</p>
                </div>
              </div>
          </li>
          <li>
            <button type="submit" onClick={() => contentsStart()}><img src={contents} alt="contents" className="mypage-icon" width="250" height="250" /></button>
            <div tabIndex={0} className="collapse collapse-arrow bg-base-100 rounded-box">
              <div className="collapse-title text-xl font-medium">
                投稿一覧
              </div>
              <div className="collapse-content"> 
                <p>自分の投稿を一覧形式で見ることができます。</p>
              </div>
            </div>
          </li>
          <li>
            <button type="submit" onClick={() => handleDeleteUser(user_id)}><img src={deleteaccount} alt="deleteaccount" className="mypage-icon" width="250" height="250" /></button>
            <div tabIndex={0} className="collapse collapse-arrow bg-base-100 rounded-box">
              <div className="collapse-title text-xl font-medium">
                退会
              </div>
              <div className="collapse-content"> 
                <p>アカウントを削除します。<br/>後から復元はできません。</p>
              </div>
            </div>
          </li>
        </ul>
      )
    }
    </div>
  )
}