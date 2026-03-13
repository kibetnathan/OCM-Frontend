import React, { useState, useEffect } from 'react';
import { useLiveStream } from '../hooks/useLivestream'; 
import Sidebar from '../components/Sidebar';

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
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setDiff({ h, m, s });
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
// Offline card
// ---------------------------------------------------------------------------

function OfflineCard({ nextService }) {
  return (
    <div className="flex flex-col items-center text-center px-10 py-12">
      {/* pulse dot — off */}
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
          <p className="font-coptic text-stone-400 text-sm mb-6 leading-relaxed">
            Next service begins in
          </p>
          <Countdown target={nextService} />
          <p className="font-coptic text-[10px] tracking-widest uppercase text-stone-600 mt-6">
            Sunday services — 9:00 AM &amp; 11:00 AM EAT
          </p>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live player
// ---------------------------------------------------------------------------

function LivePlayer({ videoId }) {
  return (
    <div className="flex flex-col">
      {/* live badge */}
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

      {/* embed */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Mavuno Church Hill City — Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* footer */}
      <div className="px-6 py-4 flex items-center justify-between">
        <p className="font-coptic text-xs text-stone-500 leading-relaxed">
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
// Page
// ---------------------------------------------------------------------------

export default function StreamingPage() {
  const { status, videoId, nextService } = useLiveStream();

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

          {status === 'live'    && <LivePlayer videoId={videoId} />}
          {status === 'offline' && <OfflineCard nextService={nextService} />}

        </div>

        <p className="font-coptic text-[10px] tracking-widest uppercase text-stone-400 mt-5 opacity-50">
          Mavuno Church Hill City
        </p>
      </div>
    </div>
  );
}