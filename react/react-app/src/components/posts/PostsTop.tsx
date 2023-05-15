import React, { useEffect, useState, useContext } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Modal from 'react-modal'
import Cookies from 'js-cookie'
import InfiniteScroll from 'react-infinite-scroller'
import 'react-tabs/style/react-tabs.css'

import { AuthContext } from '../../Context'
import { Dialog, DialogProps } from '../../Dialog'
import { getPosts, getIndexPosts, getCurrentUser, signOut } from '../../api/api_actions'
import { Post } from '../../interfaces/interface'
import { AuthTop } from '../users/AuthTop'
import { SignIn } from '../users/SignIn'
import { SignUp } from '../users/SignUp'
import { Item } from './Item'
import { Form } from './Form'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root')

export const PostsTop = () => {
  const { isSignedIn, currentUser, loading, setIsSignedIn, setCurrentUser, setLoading } = useContext(AuthContext)

  const navigation = useNavigate()
  const alert = useAlert()
  const [dialog, setDialog] = useState<DialogProps | undefined>()
  const [form, setForm] = useState<boolean>(false)
  const [signin, setSignin] = useState<boolean>(false)
  const [signup, setSignup] = useState<boolean>(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [active1, setActive1] = useState<boolean>(true)
  const [active2, setActive2] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [offset, setOffset] = useState<number>(0)

  const formstart = () =>{
    setForm(true)
  }

  const signinstart = () =>{
    setSignin(true)
  }

  const signupstart = () =>{
    setSignup(true)
  }

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      if (res?.data.is_login === true) {
        setIsSignedIn(true)
        setCurrentUser(res.data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const signoutStart = async () => {
    const ret = await new Promise<string>((resolve) => {
      setDialog({
      onClose: resolve,
      title: 'ログアウト',
      message: 'ログアウトします。よろしいですか?'
      })
    })
    setDialog(undefined)

    if (ret === 'ok') {
      try {
        const res = await signOut()
        if (res.data.success === true) {
            // サインアウト時には各Cookieを削除
            Cookies.remove("_access_token")
            Cookies.remove("_client")
            Cookies.remove("_uid")
            setIsSignedIn(false)
            navigation("/")
            alert.success('ログアウトに成功しました')
          } else {
            alert.error('ログアウトに失敗しました。アカウントが見つかりません。しばらくしてからもう一度お試しください。')
            console.log("Failed in sign out")
          }
      } catch (err) {
        alert.error('ログアウトに失敗しました。しばらくしてからもう一度お試しください。または管理者にお問合せください。')
        console.log(err)
      }
    }
  }

  // タブ切り替え
  const changeActive = () => {
    // ユーザー管理画面から移行した時、各種投稿の変更を反映するためタブ変更時はリセット関数起動
    setLoading(true)
    setActive1(!active1)
    setActive2(!active2)
  }

  // 投稿取得
  const handleGetPosts = async () => {
    try {
      const res = await getIndexPosts(12,0)
      if (res.status === 200) {
        setPosts(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // スクロールのパラメータリセット
  const resetscroll = async () => {
    setOffset(0)
    setPosts([])
    handleGetPosts()
    // 投稿が全部で12未満の場合は追加読み込みしないようにしておく
    try {
      const res = await getPosts()
      if (res.status === 200) {
        if( res.data.length <= 12 ) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const loadMore = async() => {
    try {
      const res = await getIndexPosts(12,offset)
      if (res.status === 200) {
        if (res.data.length < 1) {
          setHasMore(false)
        } else {
          setPosts([...posts, ...res.data])
          setOffset(offset + 12)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loader = <div key={0}>ロード中 ...</div>

  // 新規投稿時とログイン状態に変更があった際に、表示内容リセットの関数を起動。
  useEffect(() => {
    resetscroll()
  }, [loading])

  useEffect(() => {
    handleGetCurrentUser()
  }, [currentUser])

  return (
    <div className="home">

      {dialog && <Dialog {...dialog} />}

      <div className="navbar bg-neutral">
        <div className="flex-1">
        {
          isSignedIn && currentUser ? (
            <h1 className="text-neutral-content">ようこそ! {currentUser.name}さん！</h1>
          ) : (
            <h1 className="text-neutral-content">右のメニューからログインしてください。</h1>
          )
        }
        </div>

        <div className="posts-head-btns">
            {
              isSignedIn && currentUser ? (
                <div>
                    <button type="submit" className="btn btn-primary w-32 " onClick={() => signoutStart()}>ログアウト</button>

                    <button type="submit" className="btn btn-primary w-32" onClick={() => formstart()}>新規投稿</button>
                    <Modal isOpen={form} className="Modal">
                      <Form form={form} setForm={setForm} />
                    </Modal>
                </div>
              ) : (
                <div>
                  <button type="submit" className="btn btn-primary w-32" onClick={() => signupstart()}>会員登録</button>
                  <Modal isOpen={signup} className="Modal">
                    <SignUp signup={signup} setSignup={setSignup} />
                  </Modal>

                  <button type="submit" className="btn btn-primary w-32" onClick={() => signinstart()}>ログイン</button>
                  <Modal isOpen={signin} className="Modal">
                    <SignIn signin={signin} setSignin={setSignin} />
                  </Modal>
                </div>
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
              <div>
                <InfiniteScroll
                  hasMore={hasMore}
                  loadMore={loadMore}
                  loader={loader}>
                    <ul className="posts-list">
                      {
                        posts.map((post: Post) => (
                          <Item key={post.id} post={post} setPosts={setPosts} />
                        ))
                      }
                    </ul>
                </InfiniteScroll>
              </div>
            </TabPanel>
            <TabPanel>
              <AuthTop />
            </TabPanel>
          </Tabs>
        ) : (
          <div>
            <InfiniteScroll
              hasMore={hasMore}
              loadMore={loadMore}
              loader={loader}>
                <ul className="posts-list">
                  {
                    posts.map((post: Post) => (
                      <Item key={post.id} post={post} setPosts={setPosts} />
                    ))
                  }
                </ul>
            </InfiniteScroll>
          </div>
        )
      }
    </div>
  )
}