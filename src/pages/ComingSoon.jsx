import React from 'react';

function ComingSoon() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full min-h-screen justify-center items-center bg-amber-50">
        <div className="relative bg-[#0f0f0d]/80 border border-amber-700/30 rounded-sm p-12 w-96 text-center shadow-2xl overflow-hidden">
          <div className='absolute -top-8 -right-6 w-32 h-32 bg-amber-500/25 rounded-full blur-3xl pointer-events-none' ></div>
          <div className="w-12 h-px bg-amber-600 mx-auto mb-8" />

          <h1 className="font-cormorant text-8xl font-light text-amber-500 leading-none mb-2">
            404
          </h1>

          <p className="font-cormorant text-xs tracking-widest uppercase text-stone-400 mb-8">
            Page Not Found
          </p>


          <p className="font-coptic text-stone-400 leading-relaxed mb-10">
            The page you are looking for does not exist or has been moved.
          </p>

          <a
            href="/"
            className="inline-block font-coptic text-xs tracking-[0.4em] uppercase bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold px-8 py-3 transition-colors duration-200"
          >
            Return Home
          </a>

          <div className="w-12 h-px bg-amber-600 mx-auto mt-8" />
        </div>
      </div>
    </>
  );
}

export default ComingSoon;