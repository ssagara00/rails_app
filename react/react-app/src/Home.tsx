import React from 'react';
import { Link } from 'react-router-dom';

  export const Home = () => {
    return (
      <div>
        <h1>Welcome!!!</h1>

        <p>To Auth</p>
        <Link to={'/auth'}>Link to AuthTop</Link>

        <p>To Post</p>
        <Link to={'/posts'}>Link to PostsTop</Link>
      </div>
    )
  }

export default Home
