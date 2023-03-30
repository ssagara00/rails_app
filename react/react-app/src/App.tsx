import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './Context'
import { PostsTop } from './components/posts/PostsTop'

export const App = () => {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<PostsTop />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
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
// export default App
