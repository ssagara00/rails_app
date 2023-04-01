import React, { useState, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { AuthContext } from '../../Context'
import { myPosts } from '../../api/api_actions'
import { Post } from '../../interfaces/interface'
import { Item } from '../posts/Item'

interface MylistProps {
  contents_flg: boolean,
  setContents_flg: React.Dispatch<React.SetStateAction<boolean>>
}

export const Mylist = ({ contents_flg, setContents_flg }: MylistProps) => {
  const { currentUser } = useContext(AuthContext)
  const user_id = currentUser?.id

  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [offset, setOffset] = useState<number>(0)
  
  const contentsend = () =>{
    setContents_flg(false)
  }

  const loadMore = async() => {
    if(user_id) {
      try {
        const res = await myPosts(user_id, 12, offset)
        if (res.status === 200) {
          if (res.data.length <  1) {
            setHasMore(false)
          } else {
            setPosts([...posts, ...res.data])
            setOffset(offset + 12 )
          }
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('You have to Sign In')
    }
  }

  const loader = <div className="loader" key={0}>ロード中 ...</div>

  return (
    <div>
      <button type="submit" className="btn btn-primary" onClick={() => contentsend()}>メニューに戻る</button>
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={loadMore}    
        loader={loader}>
          <ul className="postlist">
            {
              posts.map((post: Post, index: number) => (
                <Item key={post.id} post={post} setPosts={setPosts}/>
              ))
            }
          </ul>
      </InfiniteScroll>
    </div>
  )
}