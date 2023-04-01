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
