import React, { useEffect, useState, createContext } from 'react';
import Form from './components/Form';
import { PostList } from './components/List';
import { getPosts } from './api/posts';
import { Post } from './interfaces/interface';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth } from './components/Auth';
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn"

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

  export const App = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<User | undefined>("")
    const [posts, setPosts] = useState<Post[]>([]);
    const handleGetPosts = async () => {
      try {
        const res = await getPosts()
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

    return (
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
        <div>
          <BrowserRouter>
            <h1>Hello React Router</h1>
            <Routes>
              <Route exact path={'/auth'} element={<Auth />} />
              <Route exact path={'/auth/signup'} element={<SignUp />} />
              <Route exact path={'/auth/signin'} element={<SignIn />} />
            </Routes>
          </BrowserRouter>
            <div>
              <Form posts={posts} setPosts={setPosts}/>
            </div>
            <h1>New</h1>
              <PostList posts={posts} setPosts={setPosts}/>
        </div>
      </AuthContext.Provider>
    )
  }

// デフォルト
// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
//
// }
//
export default App
