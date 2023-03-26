import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PostsTop from './components/posts/PostsTop';

import { User } from './interfaces/interface';

export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

  export const App = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<User | undefined>()
    return (
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
          <BrowserRouter>
            <Routes>
              <Route path={'/'} element={<PostsTop />} />
            </Routes>
          </BrowserRouter>
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
