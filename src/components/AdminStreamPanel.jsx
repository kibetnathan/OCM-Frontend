import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminStreamPanel() {
  const [midweekOverride, setMidweekOverride] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'streams', 'config');
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setMidweekOverride(!!snap.data().midweekOverride);
    });
    return unsub;
  }, []);

  async function toggle() {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'streams', 'config'),
        { midweekOverride: !midweekOverride },
        { merge: true }
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">

      {/* Section header */}
      <div className="mb-8">
        <p className="font-coptic text-[0.5rem] uppercase tracking-[0.3em] text-stone-500 mb-1">
          Dashboard / Streaming
        </p>
        <h1 className="font-cormorant text-3xl font-semibold text-stone-800 leading-tight">
          Stream Control
        </h1>
        <div className="w-8 h-px bg-amber-500 mt-3" />
      </div>

      {/* Info card */}
      <div className="border border-stone-200 bg-white p-5 mb-6">
        <p className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 mb-2">
          How it works
        </p>
        <p className="text-sm text-stone-500 leading-relaxed">
          Sunday services at 9:00 AM and 11:00 AM EAT are detected automatically.
          Use the toggle below to enable live stream detection during a midweek service.
          Remember to turn it off once the service ends.
        </p>
      </div>

      {/* Toggle row */}
      <div className="border border-stone-200 bg-white">
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex flex-col gap-1">
            <p className="font-cormorant text-xl font-semibold text-stone-800 leading-tight">
              Midweek Stream
            </p>
            <div className="flex items-center gap-2">
              {midweekOverride ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                  </span>
                  <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-amber-600">
                    Actively checking for live stream
                  </p>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
                    Not checking
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={toggle}
            disabled={saving}
            aria-label={midweekOverride ? 'Disable midweek stream' : 'Enable midweek stream'}
            className={`relative w-12 h-6 shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 ${
              midweekOverride ? 'bg-amber-500' : 'bg-stone-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white shadow-sm transition-transform duration-200 ${
                midweekOverride ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Warning strip -- only shown when active */}
        {midweekOverride && (
          <div className="border-t border-amber-100 bg-amber-50 px-5 py-3 flex items-center gap-2.5">
            <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-amber-600">
              Turn this off after the service ends
            </p>
          </div>
        )}
      </div>

      {/* Saving indicator */}
      {saving && (
        <p className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-400 mt-3 animate-pulse">
          Saving...
        </p>
      )}
    </div>
  );
}