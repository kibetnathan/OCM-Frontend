import { React, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ProfileSection from '../components/ProfileSection'
import Footer from '../components/Footer'
import useMainStore from '../zustand/mainStore'
import useAuthStore from '../zustand/authStore'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function Feed() {
const token = useAuthStore(state => state.token);
const posts = useMainStore(state => state.posts?.results) || [];
const fetchPosts = useMainStore(state => state.fetchPosts);
const toggleLike = useMainStore(state => state.toggleLike);
const onLikeClick = (postId) => {
    if (!token) {
        alert("Please log in to like posts!");
        return;
    }
    // Pass the specific ID to your Zustand action
    toggleLike(postId, token);
};
useEffect(() => {
  if (token) {
    fetchPosts(token);
  }
  // Adding fetchPosts to deps is safe as Zustand actions are stable
}, [token, fetchPosts]);
  return (
    <>
    <div className='flex flex-row bg-light w-full min-h-screen'>
      <Sidebar />
      <div className="w-full min-h-screen bg-light flex flex-col justify-between">
        <ul className='flex flex-row justify-around py-3 border-b border-b-khaki'>
          <li className='text-2xl font-cormorant text-stone-800 hover:cursor-pointer'>Top Posts</li>
          <li className='text-2xl font-cormorant text-stone-800 hover:cursor-pointer'>My Groups</li>
        </ul>
      <div className="flex flex-col gap-0 min-h-full">
        {posts.length > 0 ? (
          posts.map((post) => (

            <div key={post.id} className="flex flex-col gap-2 p-10 border-b border-black/35">
              <div>
                <img src={post.author.profile_pic || "/images/defaultavatar.jpg"} alt={post.author.username} className="w-10 h-10 rounded-full object-cover" />
                <span className=''>{post.author.username}</span>
              </div>
              <h3 className="text-2xl text-center font-cormorant text-stone-800">{post.title}</h3>
              <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-md" />
              <p className="text-sm text-stone-600">{post.content}</p>
              <div>
                <span className="text-xs text-stone-500">{post.author.username}</span>
                <span className="ml-2" id='like-button'><FavoriteBorderIcon onClick={() => onLikeClick(post.id)} className='text-stone-800 hover:cursor-pointer'/><span className='text-stone-800'>{post.like_count}</span></span>
              </div>
              </div>
          ))) : (
            <p className='text-center text-stone-600 mt-10'>No posts yet</p>
          ) }
      </div>
      </div>
      <ProfileSection />
    </div>
      <Footer />
    </>
  )
}

export default Feed