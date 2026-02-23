import { React, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ProfileSection from '../components/ProfileSection'
import Footer from '../components/Footer'
import useMainStore from '../zustand/mainStore'
import useAuthStore from '../zustand/authStore'

function Feed() {
const token = useAuthStore(state => state.token);
const posts = useMainStore(state => state.posts?.results) || [];
const fetchPosts = useMainStore(state => state.fetchPosts);
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

            <div key={post.id} className="flex flex-col gap-2 p-10 border-b border-white/6">
              <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-md" />
              <h3 className="text-lg font-cormorant text-stone-800">{post.title}</h3>
              <p className="text-sm text-stone-600">{post.content}</p>
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