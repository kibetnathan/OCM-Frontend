import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path

// Drop this somewhere in your admin panel / dashboard
// Only render it for users with admin role

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
    <div className="bg-[#0f0f0d]/80 border border-amber-800/30 rounded-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-px bg-amber-600" />
        <span className="font-coptic text-[10px] tracking-[0.35em] uppercase text-amber-600">
          Live Stream Control
        </span>
      </div>

      <p className="font-coptic text-stone-400 text-sm mb-6 leading-relaxed">
        Sunday services (9 AM &amp; 11 AM) are detected automatically. Use this toggle
        to enable live stream detection for a midweek service.
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-coptic text-stone-300 text-sm">Midweek stream</p>
          <p className="font-coptic text-[10px] tracking-wider uppercase text-stone-600 mt-0.5">
            {midweekOverride ? 'Actively checking for live stream' : 'Not checking'}
          </p>
        </div>

        <button
          onClick={toggle}
          disabled={saving}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            midweekOverride ? 'bg-amber-600' : 'bg-stone-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-stone-100 shadow transition-transform duration-200 ${
              midweekOverride ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {midweekOverride && (
        <p className="font-coptic text-[10px] tracking-wider uppercase text-amber-600/70 mt-4">
          Remember to turn this off after the service ends.
        </p>
      )}
    </div>
  );
}