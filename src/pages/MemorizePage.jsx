import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMemorizeStore from '../store/useMemorizeStore';

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconChevron = ({ dir = 'right' }) => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    {dir === 'right' && <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />}
    {dir === 'left'  && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />}
  </svg>
);

const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconEye = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconBrain = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
  </svg>
);

const IconFlame = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

const INTERVAL_LABELS = { 1: 'New', 3: '3d', 7: '1wk', 14: '2wk' };
const intervalLabel = (days) => INTERVAL_LABELS[days] ?? `${days}d`;
const levelLabel    = (level) => ['', 'Every 4th word', 'Every other word', 'First letters', 'Full recall'][level] ?? '';

function buildBlankedWords(text, level) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, i) => {
    let blanked = false;
    if (level === 1) blanked = (i + 1) % 4 === 0;
    if (level === 2) blanked = i % 2 !== 0;
    if (level === 3) blanked = true;
    if (level === 4) blanked = true;
    return { word, blanked };
  });
}

function firstLetterHint(word) {
  const clean = word.replace(/[^a-zA-Z]/g, '');
  if (!clean) return word;
  return clean[0] + '_'.repeat(Math.max(1, clean.length - 1));
}

// ── Practice card ──────────────────────────────────────────────────────────────

function PracticeCard({ verse, onResult, onSkip }) {
  const [level,    setLevel]    = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [done,     setDone]     = useState(false);

  const blanked = buildBlankedWords(verse.verse_text, level);

  const handleScore = async (score) => {
    setDone(true);
    await onResult(verse.id, score, level);
  };

  const advanceLevel = () => {
    if (level < 4) { setLevel(l => l + 1); setRevealed(false); }
  };

  if (done) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-5">

      {/* Reference + level badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-400 mb-0.5">{verse.translation}</p>
          <h2 className="font-cormorant text-2xl sm:text-3xl font-semibold text-stone-800">{verse.reference}</h2>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-amber-600 border border-amber-200 px-2 py-0.5 bg-amber-50">
            Level {level}
          </span>
          <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400">{levelLabel(level)}</span>
        </div>
      </div>

      {/* Verse display */}
      <div className="border border-stone-200 bg-white p-4 sm:p-6 leading-loose font-serif text-base sm:text-lg text-stone-700 min-h-[120px]">
        {blanked.map(({ word, blanked: isBlank }, i) => {
          if (!isBlank) return <span key={i}>{word} </span>;
          if (level === 3) return (
            <span key={i} className="font-coptic text-[0.65rem] text-amber-500 bg-amber-50 border border-amber-200 px-1 mx-0.5 tracking-widest">
              {firstLetterHint(word)}
            </span>
          );
          return (
            <span key={i}
              className="inline-block bg-stone-200 rounded-sm mx-0.5 align-middle"
              style={{ width: `${Math.max(1.5, word.replace(/[^a-zA-Z]/g, '').length * 0.55)}rem`, height: '1rem' }}
            />
          );
        })}
      </div>

      {/* Actions */}
      {!revealed ? (
        <div className="flex items-center gap-3">
          <button onClick={() => setRevealed(true)}
            className="flex items-center gap-2 font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 px-4 py-2.5 transition-colors"
          >
            <IconEye /> Reveal full verse
          </button>
          <button onClick={onSkip}
            className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors px-2 py-2.5"
          >
            Skip
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Full verse */}
          <div className="border-l-2 border-amber-400 pl-4 font-serif text-stone-600 text-sm leading-relaxed bg-amber-50/50 py-2 pr-3">
            {verse.verse_text}
          </div>

          {/* Score buttons */}
          <div>
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-400 mb-2">How did you do?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { score: 0, label: 'No recall',   sub: 'Back to start',  cls: 'border-red-200 hover:bg-red-50 hover:border-red-400 text-red-600' },
                { score: 1, label: 'Partial',      sub: 'Try again soon', cls: 'border-orange-200 hover:bg-orange-50 hover:border-orange-400 text-orange-600' },
                { score: 2, label: 'With effort',  sub: 'Good progress',  cls: 'border-amber-200 hover:bg-amber-50 hover:border-amber-400 text-amber-600' },
                { score: 3, label: 'Perfect',      sub: 'Keep it up',     cls: 'border-green-200 hover:bg-green-50 hover:border-green-400 text-green-700' },
              ].map(({ score, label, sub, cls }) => (
                <button key={score} onClick={() => handleScore(score)}
                  className={`flex flex-col items-center justify-center border px-3 py-3 transition-colors ${cls}`}
                >
                  <span className="font-cormorant text-base font-semibold">{label}</span>
                  <span className="font-coptic text-[0.45rem] uppercase tracking-widest mt-0.5 opacity-70">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {level < 4 && (
            <button onClick={advanceLevel}
              className="self-start font-coptic text-[0.55rem] uppercase tracking-widest text-amber-600 hover:text-amber-800 border border-amber-200 hover:border-amber-400 px-3 py-1.5 transition-colors"
            >
              Try harder — Level {level + 1} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Saved verse row ────────────────────────────────────────────────────────────

function VerseRow({ verse, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const mastered = verse.interval_days >= 14;
  const due      = verse.is_due;

  return (
    <div className={`flex items-start gap-3 px-4 py-3 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors group ${due ? 'bg-amber-50/40' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-cormorant text-base font-semibold text-stone-800">{verse.reference}</span>
          <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400">{verse.translation}</span>
          {due && !mastered && (
            <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-amber-600 border border-amber-200 bg-amber-50 px-1.5 py-0.5">Due</span>
          )}
          {mastered && (
            <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-green-600 border border-green-200 bg-green-50 px-1.5 py-0.5">Mastered</span>
          )}
        </div>
        <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400 mt-0.5">
          Interval: {intervalLabel(verse.interval_days)} · {verse.rep_count} rep{verse.rep_count !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-stone-400 mt-1 font-serif italic truncate">{verse.verse_text}</p>
      </div>

      {confirming ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => onDelete(verse.id)}
            className="font-coptic text-[0.5rem] uppercase tracking-widest text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 transition-colors"
          >Delete</button>
          <button onClick={() => setConfirming(false)}
            className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400 border border-stone-200 px-2 py-1 transition-colors"
          >Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirming(true)}
          className="p-1.5 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-200 shrink-0"
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

function MemorizePage() {
  const navigate = useNavigate();

  // Store
  const verses       = useMemorizeStore(s => s.verses);
  const dueVerses    = useMemorizeStore(s => s.dueVerses);
  const stats        = useMemorizeStore(s => s.stats);
  const loading      = useMemorizeStore(s => s.loading);
  const fetchAll     = useMemorizeStore(s => s.fetchAll);
  const submitReview = useMemorizeStore(s => s.submitReview);
  const deleteVerse  = useMemorizeStore(s => s.deleteVerse);

  // Session state — local only, no need in the store
  const [tab,         setTab]         = useState('review');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [sessionDone, setSessionDone] = useState([]); // ids reviewed this session

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Submit review result via store, then advance the local session
  const handleResult = useCallback(async (verseId, score, level) => {
    await submitReview(verseId, score, level);
    setSessionDone(prev => [...prev, verseId]);
    setReviewIndex(i => i + 1);
  }, [submitReview]);

  const handleSkip = () => setReviewIndex(i => i + 1);

  const handleDelete = useCallback(async (verseId) => {
    await deleteVerse(verseId);
  }, [deleteVerse]);

  const resetSession = useCallback(() => {
    setReviewIndex(0);
    setSessionDone([]);
    fetchAll();
  }, [fetchAll]);

  // Derived — filter out anything already done this session
  const reviewQueue   = dueVerses.filter(v => !sessionDone.includes(v.id));
  const currentVerse  = reviewQueue[reviewIndex] ?? null;
  const sessionTotal  = dueVerses.length;
  const sessionRemain = reviewQueue.length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <div className="flex flex-1 min-w-0 overflow-hidden flex-col">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-stone-200 bg-white shrink-0">
          <button onClick={() => navigate('/bible')}
            className="p-1.5 text-stone-400 hover:text-amber-500 border border-stone-200 hover:border-amber-300 transition-colors shrink-0"
          >
            <IconChevron dir="left" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-amber-500"><IconBrain /></span>
            <div>
              <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-400">Scripture</p>
              <h1 className="font-cormorant text-lg sm:text-xl font-semibold text-stone-800 leading-none">Memorize</h1>
            </div>
          </div>

          {/* Stats strip — desktop */}
          {stats && (
            <div className="hidden sm:flex items-center gap-4 shrink-0">
              {[
                { label: 'Total',    value: stats.total },
                { label: 'Due',      value: stats.due_today },
                { label: 'Mastered', value: stats.mastered },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="font-cormorant text-lg font-semibold text-stone-800 leading-none">{value}</p>
                  <p className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400 mt-0.5">{label}</p>
                </div>
              ))}
              {stats.streak > 0 && (
                <div className="flex items-center gap-1 text-amber-500 border border-amber-200 bg-amber-50 px-2.5 py-1">
                  <IconFlame />
                  <span className="font-cormorant text-base font-semibold">{stats.streak}</span>
                  <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-amber-600">day streak</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-white shrink-0">
          {[
            { key: 'review', label: `Review${stats?.due_today ? ` (${stats.due_today})` : ''}` },
            { key: 'saved',  label: `All verses${stats?.total ? ` (${stats.total})` : ''}` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3 font-coptic text-[0.55rem] uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                tab === key
                  ? 'text-amber-600 border-amber-500'
                  : 'text-stone-400 border-transparent hover:text-stone-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full gap-3">
              <div className="w-5 h-5 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
              <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">Loading…</p>
            </div>
          ) : tab === 'review' ? (

            /* ── REVIEW TAB ── */
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

              {/* Progress bar */}
              {sessionTotal > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">Session progress</span>
                    <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
                      {sessionTotal - sessionRemain} / {sessionTotal}
                    </span>
                  </div>
                  <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${((sessionTotal - sessionRemain) / sessionTotal) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* No due verses */}
              {dueVerses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-14 h-14 border border-stone-200 flex items-center justify-center text-stone-200">
                    <IconCheck />
                  </div>
                  <p className="font-cormorant text-2xl text-stone-400">All caught up</p>
                  <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">No verses due for review</p>
                  <button onClick={() => navigate('/bible')}
                    className="mt-2 font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 border border-amber-200 hover:bg-amber-50 px-4 py-2 transition-colors"
                  >Save more verses →</button>
                </div>
              )}

              {/* Session complete */}
              {dueVerses.length > 0 && sessionRemain === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-14 h-14 border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-500">
                    <IconCheck />
                  </div>
                  <p className="font-cormorant text-2xl text-stone-700">Session complete</p>
                  <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">
                    {sessionTotal} verse{sessionTotal !== 1 ? 's' : ''} reviewed
                  </p>
                  <button onClick={resetSession}
                    className="mt-2 font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 border border-amber-200 hover:bg-amber-50 px-4 py-2 transition-colors"
                  >Review again</button>
                </div>
              )}

              {/* Active card */}
              {currentVerse && (
                <PracticeCard
                  key={currentVerse.id}
                  verse={currentVerse}
                  onResult={handleResult}
                  onSkip={handleSkip}
                />
              )}
            </div>

          ) : (

            /* ── SAVED TAB ── */
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

              {/* Mobile stats */}
              {stats && (
                <div className="sm:hidden flex items-center gap-4 mb-5 pb-5 border-b border-stone-100">
                  {[
                    { label: 'Total',    value: stats.total },
                    { label: 'Due',      value: stats.due_today },
                    { label: 'Mastered', value: stats.mastered },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="font-cormorant text-xl font-semibold text-stone-800">{value}</p>
                      <p className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {verses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <p className="font-cormorant text-2xl text-stone-400">No saved verses yet</p>
                  <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">
                    Tap the bookmark on any verse in the Bible reader
                  </p>
                  <button onClick={() => navigate('/bible')}
                    className="mt-2 font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 border border-amber-200 hover:bg-amber-50 px-4 py-2 transition-colors"
                  >Open Bible reader →</button>
                </div>
              ) : (
                <div className="border border-stone-200 bg-white">
                  {verses.map(verse => (
                    <VerseRow key={verse.id} verse={verse} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemorizePage;