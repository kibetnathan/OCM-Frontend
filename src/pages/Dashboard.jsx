import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <>
        <div className='min-h-screen w-full bg-light flex flex-row'>
        <Sidebar />
        <Outlet />
        </div>
    </>
  )
}

export default Dashboard