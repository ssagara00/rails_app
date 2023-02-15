/* eslint-disable */
import React from "react";

import { Post } from '../../interfaces/interface';

import Item from './Item';

interface PostListProps {
  posts: Post[]
  setPosts: Function
}

  export const List = ({ posts, setPosts }: PostListProps) => {
    return (
      <ul className="postlist">
        {
          posts.map((post: Post, index: number) => (
            <Item key={index} post={post} setPosts={setPosts}/>
          ))
        }
      </ul>
    )
  }

export default List
