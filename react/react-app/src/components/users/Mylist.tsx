import React, { useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { AuthContext } from "../../App";
import { myPosts } from '../../api/api_actions';

import Item from '../posts/Item';

import { Post } from '../../interfaces/interface';

interface MylistProps {
  contents_flg: boolean,
  setContents_flg: Function
}

  export const Mylist = ({ contents_flg, setContents_flg }: MylistProps) => {
    const { currentUser } = useContext(AuthContext);
    const user_id = currentUser?.id || 0;

    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    
    const contentsend = () =>{
      setContents_flg(false);
    }

    const loadMore = async() => {
      try {
        const res = await myPosts(user_id, 12, offset);
        if (res?.status === 200) {
          if (res?.data.length <  1) {
            setHasMore(false);
            return
          } else {
            setPosts([...posts, ...res.data]);
            setOffset(offset + 12 );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    const loader = <div className="loader" key={0}>Loading ...</div>;

    return (
      <div>
        <button className="btn btn-primary" onClick={() => contentsend()}>back to menu</button>
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

export default Mylist
