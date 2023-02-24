import React, { useEffect, useState, useContext } from 'react';
import Modal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from "js-cookie";

import { getCurrentUser, signOut } from "../../api/auth"
import { AuthContext } from "../../App";

import { Post } from '../../interfaces/interface';
import { getIndexPosts } from '../../api/posts';

import AuthTop from '../users/AuthTop';
import SignIn from '../users/SignIn';
import SignUp from '../users/SignUp';

import List from './List';
import Form from './Form';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

  export const PostsTop = () => {
    const navigation = useNavigate();
    const [form, setForm] = useState(false);
    const [resetoffset, setResetoffset] = useState(false);
    const [signin, setSignin] = useState(false);
    const [signup, setSignup] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [active1, setActive1] = useState(true);
    const [active2, setActive2] = useState(false);
    const { isSignedIn, currentUser, setIsSignedIn, setCurrentUser, setLoading } = useContext(AuthContext);

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
          setIsSignedIn(true)
          setCurrentUser(res?.data.data)
        } else {
          console.log("No current user")
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }

    const signoutstart = async () => {
      try {
        const res = await signOut()
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
      } catch (err) {
        console.log(err)
      }
    }

    const changeactive = () => {
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
        console.log(err)
      }
    }

    useEffect(() => {
      handleGetPosts()
    }, [])

    useEffect(() => {
      handleGetCurrentUser()
    }, [currentUser])

    return (
      <div>
        <div className="navbar bg-neutral text-neutral-content">
          <div className="flex-1">
          {
            isSignedIn && currentUser ? (
              <div>
                <h1>WELCOME {currentUser?.name}!!</h1>
              </div>
            ) : (
              <h1>Not signed in</h1>
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
                      <button className="btn btn-primary" onClick={() => signoutstart()}>SignOut</button>
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
        <Tabs>
          <TabList>
          <div className="tabs">
            <Tab><p className={active1 ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={changeactive}>post_LIST</p></Tab>
            <Tab><p className={active2 ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={changeactive}>Auth_List</p></Tab>
          </div>
          </TabList>
          <TabPanel>
            <List posts={posts} setPosts={setPosts} resetoffset={resetoffset} setResetoffset={setResetoffset} />
          </TabPanel>
          <TabPanel>
            <AuthTop />
          </TabPanel>
        </Tabs>
      </div>
    )
  }

export default PostsTop;
