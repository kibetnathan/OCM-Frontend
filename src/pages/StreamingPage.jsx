import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useLiveStream } from '../hooks/useLivestream';

// ---------------------------------------------------------------------------
// Countdown
// ---------------------------------------------------------------------------

function useCountdown(target) {
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    if (!target) return;
    function tick() {
      const ms = new Date(target) - Date.now();
      if (ms <= 0) { setDiff(null); return; }
      setDiff({
        h: Math.floor(ms / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return diff;
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-cormorant text-5xl font-light text-amber-500 leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-coptic text-[9px] tracking-[0.3em] uppercase text-stone-500 mt-1">
        {label}
      </span>
    </div>
  );
}

function Countdown({ target }) {
  const diff = useCountdown(target);
  if (!diff) return null;
  return (
    <div className="flex items-end gap-4">
      <CountdownUnit value={diff.h} label="hrs" />
      <span className="font-cormorant text-3xl text-amber-700 mb-2">:</span>
      <CountdownUnit value={diff.m} label="min" />
      <span className="font-cormorant text-3xl text-amber-700 mb-2">:</span>
      <CountdownUnit value={diff.s} label="sec" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live player
// ---------------------------------------------------------------------------

function LivePlayer({ videoId }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-6 pt-6 pb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="font-coptic text-[10px] tracking-[0.35em] uppercase text-red-400">
          Live Now
        </span>
        <div className="flex-1 h-px bg-amber-700/20" />
        <span className="font-cormorant text-xs text-stone-500 tracking-wide">
          Mavuno Church Hill City
        </span>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Mavuno Church Hill City — Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="px-6 py-4 flex items-center justify-between">
        <p className="font-coptic text-xs text-stone-500">
          Join us in worship — share this stream with someone.
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-coptic text-[10px] tracking-[0.3em] uppercase text-amber-600 hover:text-amber-500 transition-colors whitespace-nowrap ml-4"
        >
          Open on YouTube ↗
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Latest video card
// ---------------------------------------------------------------------------

function LatestVideoCard({ video }) {
  const [playing, setPlaying] = useState(false);

  const publishedDate = new Date(video.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="border-t border-amber-800/20">
      {/* header */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-3">
        <div className="w-4 h-px bg-amber-700/50" />
        <span className="font-coptic text-[10px] tracking-[0.35em] uppercase text-stone-500">
          Latest Message
        </span>
        <div className="flex-1 h-px bg-amber-700/20" />
        <span className="font-coptic text-[10px] text-stone-600">
          {publishedDate}
        </span>
      </div>

      {/* player / thumbnail */}
      <div className="px-6 pb-2">
        {playing ? (
          <div className="relative w-full rounded-sm overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="relative w-full rounded-sm overflow-hidden group focus:outline-none"
            aria-label={`Play ${video.title}`}
          >
            {/* thumbnail */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full object-cover"
              style={{ aspectRatio: '16/9' }}
            />
            {/* dark overlay */}
            <div className="absolute inset-0 bg-[#0f0f0d]/50 group-hover:bg-[#0f0f0d]/30 transition-colors duration-200" />
            {/* play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-amber-600/70 bg-[#0f0f0d]/60 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-[#0f0f0d]/40 transition-all duration-200">
                <svg className="w-5 h-5 text-amber-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* title + description */}
      <div className="px-6 pt-2 pb-5">
        <h3 className="font-cormorant text-xl text-amber-100 leading-snug mb-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="font-coptic text-xs text-stone-500 leading-relaxed line-clamp-2">
            {video.description}
          </p>
        )}
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-coptic text-[10px] tracking-[0.3em] uppercase text-amber-700 hover:text-amber-500 transition-colors mt-3"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Offline state (countdown + latest video)
// ---------------------------------------------------------------------------

function OfflineCard({ nextService, latestVideo }) {
  return (
    <div className="flex flex-col">
      {/* countdown section */}
      <div className="flex flex-col items-center text-center px-10 pt-10 pb-8">
        <div className="w-2 h-2 rounded-full bg-stone-600 mb-8" />

        <h1 className="font-cormorant text-5xl font-light text-amber-500 leading-tight mb-2">
          No Live Stream
        </h1>
        <p className="font-cormorant text-xs tracking-widest uppercase text-stone-500 mb-8">
          Currently Offline
        </p>

        <div className="flex items-center gap-3 w-full mb-8">
          <div className="flex-1 h-px bg-amber-700/25" />
          <div className="w-1.5 h-1.5 bg-amber-700/40 rotate-45" />
          <div className="flex-1 h-px bg-amber-700/25" />
        </div>

        {nextService && (
          <>
            <p className="font-coptic text-stone-400 text-sm mb-6">
              Next service begins in
            </p>
            <Countdown target={nextService} />
            <p className="font-coptic text-[10px] tracking-widest uppercase text-stone-600 mt-6">
              Sunday services — 9:00 AM &amp; 11:00 AM EAT
            </p>
          </>
        )}
      </div>

      {/* latest video */}
      {latestVideo && <LatestVideoCard video={latestVideo} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StreamingPage() {
  const { status, videoId, latestVideo, nextService } = useLiveStream();

  return (
    <div className='flex flex-row'>
      <Sidebar />
      <div
        className="flex flex-col w-full min-h-screen justify-center items-center bg-amber-50 px-4 py-12"
      >
        <div className="bg-[#0f0f0d]/90 border border-amber-800/40 rounded-sm w-full max-w-3xl shadow-2xl overflow-hidden">

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-coptic text-xs tracking-widest uppercase text-stone-500">
                Checking stream status…
              </p>
            </div>
          )}

          {status === 'live' && (
            <>
              <LivePlayer videoId={videoId} />
              {latestVideo && <LatestVideoCard video={latestVideo} />}
            </>
          )}

          {status === 'offline' && (
            <OfflineCard nextService={nextService} latestVideo={latestVideo} />
          )}
        </div>

        <p className="font-coptic text-[10px] tracking-widest uppercase text-stone-400 mt-5 opacity-50">
          Mavuno Church Hill City
        </p>
      </div>
    </div>
  );
}