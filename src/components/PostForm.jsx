import React from 'react'
import { Link } from 'react-router-dom'

function PostForm() {
  return (
    <>
        <div className="flex flex-row bg-light w-full min-h-screen p-10">
        <Link to={"/feed/"} className='bg-amber-600 text-stone-800 font-coptic px-5 py-2 text-2xl h-fit w-fit'>&lt;- Back</Link>
        </div>
    </>
  )
}

export default PostForm