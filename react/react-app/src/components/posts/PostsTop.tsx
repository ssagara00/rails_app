import React, { useEffect, useState, useContext } from 'react';
import Modal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Cookies from "js-cookie";

import { AuthContext } from "../../App";
import { getCurrentUser, signOut } from "../../api/auth";
import { getIndexPosts } from '../../api/posts';

import AuthTop from '../users/AuthTop';
import SignIn from '../users/SignIn';
import SignUp from '../users/SignUp';
import List from './List';
import Form from './Form';
import { Dialog, DialogProps } from '../../Dialog';

import { Post } from '../../interfaces/interface';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

  export const PostsTop = () => {
    const { isSignedIn, currentUser, setIsSignedIn, setCurrentUser, setLoading } = useContext(AuthContext);

    const navigation = useNavigate();
    const alert = useAlert();
    const [dialog, setDialog] = useState<DialogProps | undefined>();
    const [form, setForm] = useState(false);
    const [signin, setSignin] = useState(false);
    const [signup, setSignup] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [resetoffset, setResetoffset] = useState(false);
    const [active1, setActive1] = useState(true);
    const [active2, setActive2] = useState(false);

    const formstart = () =>{
      setForm(true);
    }

    const signinstart = () =>{
      setSignin(true);
    }

    const signupstart = () =>{
      setSignup(true);
    }

    const handleGetCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res?.data.is_login === true) {
          setIsSignedIn(true);
          setCurrentUser(res?.data.data);
        } else {
          console.log("No current user");
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }

    const signoutStart = async () => {
      const ret = await new Promise<string>((resolve) => {
        setDialog({
        onClose: resolve,
        title: 'ログアウト',
        message: 'ログアウトします。よろしいですか?'
        })
      })
      setDialog(undefined);

      if (ret === 'ok') {
        try {
          const res = await signOut();
          if (res.data.success === true) {
              // サインアウト時には各Cookieを削除
              Cookies.remove("_access_token");
              Cookies.remove("_client");
              Cookies.remove("_uid");
              setIsSignedIn(false);
              navigation("/posts");
              alert.success('ログアウトに成功しました');
              console.log("Succeeded in sign out");
            } else {
              alert.error('ログアウトに失敗しました');
              console.log("Failed in sign out");
            }
        } catch (err) {
          alert.error('ログアウトに失敗しました');
          console.log(err);
        }
      }
    }

    // タブ切り替え
    const changeActive = () => {
      setActive1(!active1);
      setActive2(!active2);
    }

    const handleGetPosts = async () => {
      try {
        const res = await getIndexPosts(10,0);
        if (res?.status === 200) {
          setPosts(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(() => {
      handleGetPosts();
    }, [])

    useEffect(() => {
      handleGetCurrentUser();
    }, [setCurrentUser])

    return (
      <div className="height">

        {dialog && <Dialog {...dialog} />}

        <div className="navbar bg-neutral text-neutral-content">
          <div className="flex-1">
          {
            isSignedIn && currentUser ? (
              <div>
                <h1>WELCOME! {currentUser?.name}</h1>
              </div>
            ) : (
              <h1>Not Signed In</h1>
            )
          }

          </div>

          <div className="flex-none">
              {
                isSignedIn && currentUser ? (
                  <ul className="menu menu-horizontal px-1">
                    <li>
                      <button className="btn btn-primary" onClick={() => signupstart()}>Open Signup</button>
                      <Modal isOpen={signup} className="Modal">
                        <SignUp signup={signup} setSignup={setSignup} />
                      </Modal>
                    </li>
                    <li>
                      <button className="btn btn-primary" onClick={() => signoutStart()}>SignOut</button>
                    </li>
                    <li>
                      <button className="btn btn-primary" onClick={() => formstart()}>Open Form</button>
                      <Modal isOpen={form} className="Modal">
                        <Form form={form} setForm={setForm} posts={posts} setPosts={setPosts} resetoffset={resetoffset} setResetoffset={setResetoffset}/>
                      </Modal>
                    </li>
                  </ul>
                ) : (
                  <ul className="menu menu-horizontal px-1">
                    <li>
                      <button className="btn btn-primary" onClick={() => signupstart()}>Open Signup</button>
                      <Modal isOpen={signup} className="Modal">
                        <SignUp signup={signup} setSignup={setSignup} />
                      </Modal>
                    </li>
                    <li>
                      <button className="btn btn-primary" onClick={() => signinstart()}>Open Signin</button>
                      <Modal isOpen={signin} className="Modal">
                        <SignIn signin={signin} setSignin={setSignin} />
                      </Modal>
                    </li>
                  </ul>
                )
              }
          </div>
        </div>
        {
          isSignedIn && currentUser ? (
            <Tabs>
              <TabList className = "tabList">
                <Tab className = "tab"><p onClick={changeActive}>投稿一覧</p></Tab>
                <Tab className = "tab"><p onClick={changeActive}>ユーザー情報管理画面</p></Tab>
              </TabList>
              <TabPanel>
                <List posts={posts} setPosts={setPosts} resetoffset={resetoffset} setResetoffset={setResetoffset} />
              </TabPanel>
              <TabPanel>
                <AuthTop />
              </TabPanel>
            </Tabs>
          ) : (
            <List posts={posts} setPosts={setPosts} resetoffset={resetoffset} setResetoffset={setResetoffset} />
          )
        }
      </div>
    )
  }

export default PostsTop;
