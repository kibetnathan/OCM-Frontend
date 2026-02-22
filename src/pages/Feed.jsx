import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileSection from '../components/ProfileSection'
import Footer from '../components/Footer'
function Feed() {
  return (
    <div className='flex flex-row bg-light w-full min-h-screen'>
      <Sidebar />
      <ProfileSection />
      <Footer />
    </div>
  )
}

export default Feed