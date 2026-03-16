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
    <div className="flex flex-col items-center min-w-[4.5rem]">
      <span className="font-cormorant text-6xl md:text-7xl font-light text-amber-600 leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-coptic text-[0.45rem] tracking-[0.35em] uppercase text-stone-400 mt-2">
        {label}
      </span>
    </div>
  );
}

function Countdown({ target }) {
  const diff = useCountdown(target);
  if (!diff) return null;
  return (
    <div className="flex items-end gap-3 md:gap-5">
      <CountdownUnit value={diff.h} label="hours" />
      <span className="font-cormorant text-4xl text-amber-300 mb-4 leading-none">:</span>
      <CountdownUnit value={diff.m} label="minutes" />
      <span className="font-cormorant text-4xl text-amber-300 mb-4 leading-none">:</span>
      <CountdownUnit value={diff.s} label="seconds" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live badge
// ---------------------------------------------------------------------------

function LiveBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <span className="font-coptic text-[0.48rem] tracking-[0.4em] uppercase text-red-500">
        Live Now
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live player
// ---------------------------------------------------------------------------

function LivePlayer({ videoId, latestVideo }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">

      {/* Header strip */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-stone-200 shrink-0 bg-white">
        <LiveBadge />
        <span className="font-coptic text-[0.48rem] tracking-[0.25em] uppercase text-stone-400">
          Mavuno Church Hill City
        </span>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-coptic text-[0.48rem] tracking-[0.3em] uppercase text-amber-600 hover:text-amber-700 transition-colors"
        >
          YouTube ↗
        </a>
      </div>

      {/* Player */}
      <div className="relative w-full bg-stone-900" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Mavuno Church Hill City — Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Caption strip */}
      <div className="px-6 md:px-10 py-4 border-b border-stone-200 bg-white flex items-center justify-between shrink-0">
        <p className="font-coptic text-[0.55rem] text-stone-400 tracking-wider">
          Join us in worship — share this stream with someone.
        </p>
      </div>

      {/* Latest video */}
      {latestVideo && (
        <div className="px-6 md:px-10 py-7 bg-[#faf8f3] border-b border-stone-200">
          <p className="font-coptic text-[0.48rem] uppercase tracking-[0.3em] text-stone-400 mb-4">
            Latest Message
          </p>
          <LatestVideoRow video={latestVideo} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Latest video -- compact horizontal row
// ---------------------------------------------------------------------------

function LatestVideoRow({ video }) {
  const [playing, setPlaying] = useState(false);
  const publishedDate = new Date(video.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  if (playing) {
    return (
      <div className="relative w-full" style={{ paddingBottom: '42%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 group">
      <button
        onClick={() => setPlaying(true)}
        className="relative w-32 md:w-44 shrink-0 overflow-hidden focus:outline-none"
        aria-label={`Play ${video.title}`}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full object-cover"
          style={{ aspectRatio: '16/9' }}
        />
        <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/20 transition-colors duration-200 flex items-center justify-center">
          <div className="w-8 h-8 border border-white/60 bg-stone-900/50 flex items-center justify-center">
            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-cormorant text-xl text-stone-800 leading-snug truncate">
          {video.title}
        </h3>
        <p className="font-coptic text-[0.48rem] text-stone-400 mt-1">{publishedDate}</p>
        {video.description && (
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-1 mt-1 hidden md:block font-light">
            {video.description}
          </p>
        )}
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-coptic text-[0.48rem] tracking-[0.3em] uppercase text-amber-600 hover:text-amber-700 transition-colors shrink-0 hidden md:block"
      >
        Watch ↗
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Latest video -- full card for offline state
// ---------------------------------------------------------------------------

function LatestVideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const publishedDate = new Date(video.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="border-t border-stone-200 bg-white px-6 md:px-16 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-px bg-amber-400/60" />
        <span className="font-coptic text-[0.48rem] tracking-[0.35em] uppercase text-stone-400">
          Latest Message
        </span>
        <div className="flex-1 h-px bg-stone-200" />
        <span className="font-coptic text-[0.48rem] text-stone-300">{publishedDate}</span>
      </div>

      {playing ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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
          className="relative w-full overflow-hidden group focus:outline-none"
          aria-label={`Play ${video.title}`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/20 transition-colors duration-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border border-white/50 bg-stone-900/50 flex items-center justify-center group-hover:border-white group-hover:scale-105 transition-all duration-200">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Title overlay */}
          <div className="absolute bottom-0 inset-x-0 px-5 py-5 bg-gradient-to-t from-stone-900/80 to-transparent">
            <h3 className="font-cormorant text-2xl text-white leading-snug line-clamp-2">
              {video.title}
            </h3>
          </div>
        </button>
      )}

      {!playing && video.description && (
        <p className="text-sm text-stone-400 leading-relaxed line-clamp-2 mt-4 font-light">
          {video.description}
        </p>
      )}

      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-coptic text-[0.48rem] tracking-[0.3em] uppercase text-amber-600 hover:text-amber-700 transition-colors mt-5"
      >
        Watch on YouTube ↗
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Offline state
// ---------------------------------------------------------------------------

function OfflinePage({ nextService, latestVideo }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto bg-[#faf8f3]">

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-8 md:px-16 pt-16 pb-14 flex-1">

        {/* Top rule */}
        <div className="flex items-center gap-4 w-full max-w-xs mb-12">
          <div className="flex-1 h-px bg-stone-200" />
          <div className="w-1 h-1 bg-amber-400 rotate-45" />
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Offline indicator */}
        <div className="flex items-center gap-2 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="font-coptic text-[0.48rem] tracking-[0.4em] uppercase text-stone-400">
            Currently Offline
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-cormorant text-5xl md:text-7xl font-light text-stone-800 leading-tight mb-2">
          No Live Stream
        </h1>
        <p className="font-cormorant text-lg text-amber-600/80 tracking-widest mb-10">
          Mavuno Church Hill City
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-sm mb-10">
          <div className="flex-1 h-px bg-stone-200" />
          <div className="w-1 h-1 bg-stone-300 rotate-45" />
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Countdown */}
        {nextService && (
          <div className="flex flex-col items-center gap-6">
            <p className="font-coptic text-[0.52rem] tracking-[0.3em] uppercase text-stone-400">
              Next service begins in
            </p>
            <Countdown target={nextService} />
            <p className="font-coptic text-[0.45rem] tracking-[0.25em] uppercase text-stone-300 mt-1">
              Sunday services — 9:00 AM &amp; 11:00 AM EAT
            </p>
          </div>
        )}
      </div>

      {/* Latest video */}
      {latestVideo && <LatestVideoCard video={latestVideo} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-5 bg-[#faf8f3]">
      <div className="w-5 h-5 border border-stone-300 border-t-amber-500 rounded-full animate-spin" />
      <p className="font-coptic text-[0.48rem] tracking-[0.35em] uppercase text-stone-400">
        Checking stream status
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StreamingPage() {
  const { status, videoId, latestVideo, nextService } = useLiveStream();
  
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Page header */}
        <div className="flex items-center justify-between px-6 md:px-10 h-14 border-b border-stone-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <p className="font-coptic text-[0.48rem] uppercase tracking-[0.3em] text-stone-400">
              Streaming
            </p>
            <div className="w-px h-3 bg-stone-200" />
            <p className="font-cormorant text-base text-stone-500">
              Live &amp; On Demand
            </p>
          </div>
          {status === 'live' && <LiveBadge />}
        </div>

        {/* Content */}
        {status === 'loading' && <LoadingState />}
        {status === 'live'    && <LivePlayer videoId={videoId} latestVideo={latestVideo} />}
        {status === 'offline' && <OfflinePage nextService={nextService} latestVideo={latestVideo} />}

      </main>
    </div>
  );
}