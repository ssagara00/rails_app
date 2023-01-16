import React, { useState } from "react";

import { Post } from '../../interfaces/interface';

import Item from './Item';

interface PostListProps {
  posts: Post[]
  setPosts: Function
}

  export const List = ({ posts, setPosts }: PostListProps) => {
    return (
      <div className="wrapper">
        {
          posts.map((post: Post, index: number) => (
            <Item key={index} post={post} setPost={setPosts}/>
          ))
        }
      </div>
    )
  }

export default List
