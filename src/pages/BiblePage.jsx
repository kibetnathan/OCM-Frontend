import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';

const BASE = 'https://bible.helloao.org/api';
const DEFAULT_TRANSLATION = 'BSB';

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function renderVerseContent(content) {
  return content.map((item, i) => {
    if (typeof item === 'string') return <span key={i}>{item} </span>;
    if (item.text) {
      if (item.wordsOfJesus) return <span key={i} className="text-red-600">{item.text} </span>;
      if (item.poem)         return <span key={i} className="block pl-4 italic text-stone-600">{item.text}</span>;
      return <span key={i}>{item.text} </span>;
    }
    if (item.heading)   return <span key={i} className="block font-cormorant text-lg font-semibold text-stone-700 mt-4 mb-1">{item.heading}</span>;
    if (item.lineBreak) return <br key={i} />;
    if (item.noteId !== undefined) return <sup key={i} className="text-amber-600 text-[0.6rem] cursor-pointer ml-0.5">[{item.noteId + 1}]</sup>;
    return null;
  });
}

// ── Verse component ────────────────────────────────────────────────────────────

function VerseBlock({ verse, highlighted, onHighlight }) {
  const isHighlighted = highlighted === verse.number;
  return (
    <p
      id={`v${verse.number}`}
      onClick={() => onHighlight(verse.number)}
      className={`leading-loose text-base font-serif cursor-pointer rounded px-2 py-0.5 transition-colors ${
        isHighlighted ? 'bg-amber-100 border-l-2 border-amber-500' : 'hover:bg-stone-50'
      }`}
    >
      <sup className="font-coptic text-[0.55rem] text-amber-500 mr-1.5 select-none">{verse.number}</sup>
      {renderVerseContent(verse.content)}
    </p>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

function BiblePage() {
  const [translations, setTranslations] = useState([]);
  const [translation,  setTranslation]  = useState(DEFAULT_TRANSLATION);
  const [books,        setBooks]        = useState([]);
  const [showTransDD,  setShowTransDD]  = useState(false);
  const [transSearch,  setTransSearch]  = useState('');

  const [selectedBook,  setSelectedBook]  = useState(null);
  const [chapterNum,    setChapterNum]    = useState(1);
  const [chapterData,   setChapterData]   = useState(null);
  const [bookSearch,    setBookSearch]    = useState('');
  const [showBookPanel, setShowBookPanel] = useState(true);

  const [loadingBooks,   setLoadingBooks]   = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [highlighted,    setHighlighted]    = useState(null);
  const [showFootnotes,  setShowFootnotes]  = useState(false);

  const contentRef = useRef(null);

  // ── Fetch translations on mount ──
  useEffect(() => {
    fetch(`${BASE}/available_translations.json`)
      .then(r => r.json())
      .then(d => setTranslations(d.translations.filter(t => t.language === 'eng')))
      .catch(() => {});
  }, []);

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