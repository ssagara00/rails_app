import React, { useEffect, useState } from 'react';
import Form from './components/Form';
import { PostList } from './components/List';
import { getPosts } from './api/posts';
import { Post } from './interfaces/interface';

  export const App = () => {
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
      <div>
        <div>
          <Form posts={posts} setPosts={setPosts}/>
        </div>
        <h1>New</h1>
          <PostList posts={posts} setPosts={setPosts}/>
      </div>
    );
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
