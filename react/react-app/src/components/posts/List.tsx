import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { getIndexPosts } from '../../api/posts';

import Item from './Item';

import { Post } from '../../interfaces/interface';

interface PostListProps {
  posts: Post[]
  setPosts: Function
  resetoffset: boolean
  setResetoffset: Function
}

  export const List = ({ posts, setPosts, resetoffset, setResetoffset }: PostListProps) => {
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    const loadMore = async() => {
      try {
        if(resetoffset == true ) {
          setOffset(10);
          setResetoffset(false);
        }
        const res = await getIndexPosts(10,offset);
        if (res?.status === 200) {
          if (res?.data.length <  1) {
            setHasMore(false);
            return
          } else {
            setPosts([...posts, ...res.data]);
            setOffset(offset + 10 );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    const loader = <div className="loader" key={0}>Loading ...</div>;

    return (
    <div>
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={loadMore}    
        loader={loader}>
          <ul className="postlist">
            {
              posts.map((post: Post, index: number) => (
                <Item key={index} post={post} setPosts={setPosts}/>
              ))
            }
          </ul>
      </InfiniteScroll>
    </div>
    )
  }

export default List
