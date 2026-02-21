import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileSection from '../components/ProfileSection'
function Feed() {
  return (
    <div className='flex flex-row bg-light'>
      <Sidebar />
      <ProfileSection />
    </div>
  )
}

export default Feed