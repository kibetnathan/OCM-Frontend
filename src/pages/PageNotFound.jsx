import React from 'react';
import Navbar from '../components/Navbar';

function PageNotFound() {
  return (
    <>
      <Navbar />
      <div className='flex flex-col bg-light w-full min-h-screen justify-center items-center'>
        <div className="card card-dash bg-khaki w-96">
          <div className="card-body">
            <h2 className="card-title">404</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;