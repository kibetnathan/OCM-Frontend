import React from 'react';
import Sidebar from '../components/Sidebar';

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconChevron = ({ dir = 'right' }) => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    {dir === 'right' && <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />}
    {dir === 'left'  && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />}
    {dir === 'down'  && <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />}
  </svg>
);

const IconBook = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

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