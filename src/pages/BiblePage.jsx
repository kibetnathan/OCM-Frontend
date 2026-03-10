import React from 'react';
import Sidebar from '../components/Sidebar';

function BiblePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* content goes here */}
      </div>
    </div>
  );
}

export default BiblePage;