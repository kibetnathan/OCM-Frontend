import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useMemorizeStore from '../zustand/useMemoriseStore';

const BASE = 'https://bible.helloao.org/api';
const DEFAULT_TRANSLATION = 'BSB';

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconChevron = ({ dir = 'right' }) => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    {dir === 'right' && <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />}
    {dir === 'left'  && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />}
    {dir === 'down'  && <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />}
    {dir === 'up'    && <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />}
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

const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconMenu = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const IconBookmark = ({ filled = false }) => (
  <svg className="w-3.5 h-3.5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

const IconBrain = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractPlainText(content) {
  return content
    .map(item => {
      if (typeof item === 'string') return item;
      if (item.text) return item.text;
      return '';
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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

// ── Bookmark toast ─────────────────────────────────────────────────────────────

function BookmarkToast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 border shadow-lg text-xs font-coptic tracking-widest uppercase transition-all
      ${type === 'error'  ? 'bg-red-50 border-red-200 text-red-600' :
        type === 'exists' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            'bg-white border-stone-200 text-stone-700'}`}
    >
      {type === 'success' && <IconBookmark filled />}
      {message}
    </div>
  );
}

// ── Verse component ────────────────────────────────────────────────────────────

function VerseBlock({ verse, highlighted, onHighlight, isSaved, onBookmark, bookmarking }) {
  const isHighlighted = highlighted === verse.number;
  const isBookmarking = bookmarking === verse.number;

  return (
    <p
      id={`v${verse.number}`}
      onClick={() => onHighlight(verse.number)}
      className={`group relative leading-loose text-base font-serif cursor-pointer rounded px-2 py-0.5 transition-colors ${
        isHighlighted ? 'bg-amber-100 border-l-2 border-amber-500 pr-10' : 'hover:bg-stone-50'
      }`}
    >
      <sup className="font-coptic text-[0.55rem] text-amber-500 mr-1.5 select-none">{verse.number}</sup>
      {renderVerseContent(verse.content)}

      {isHighlighted && (
        <button
          onClick={e => { e.stopPropagation(); onBookmark(verse); }}
          disabled={isSaved || isBookmarking}
          title={isSaved ? 'Already saved' : 'Save to memorize'}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 border transition-colors
            ${isSaved
              ? 'text-amber-500 border-amber-200 bg-amber-50 cursor-default'
              : 'text-stone-400 border-stone-200 hover:text-amber-500 hover:border-amber-300 hover:bg-amber-50'
            }`}
        >
          {isBookmarking
            ? <div className="w-3.5 h-3.5 border border-amber-400/40 border-t-amber-500 rounded-full animate-spin" />
            : <IconBookmark filled={isSaved} />
          }
        </button>
      )}
    </p>
  );
}

// ── Book List ──────────────────────────────────────────────────────────────────

function BookList({ books, selectedBook, loadingBooks, bookSearch, setBookSearch, onSelectBook }) {
  const filteredBooks = books.filter(b => b.name.toLowerCase().includes(bookSearch.toLowerCase()));
  const filteredOT = filteredBooks.filter(b => b.order <= 39);
  const filteredNT = filteredBooks.filter(b => b.order > 39);

  return (
    <>
      <div className="px-3 py-2.5 border-b border-white/6 shrink-0">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-600"><IconSearch /></span>
          <input
            type="text"
            value={bookSearch}
            onChange={e => setBookSearch(e.target.value)}
            placeholder="Find book…"
            className="w-full bg-white/5 border border-white/8 focus:border-amber-500/40 focus:outline-none pl-8 pr-3 py-1.5 text-[0.7rem] text-stone-300 placeholder:text-stone-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {loadingBooks ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {filteredOT.length > 0 && (
              <>
                <p className="font-coptic text-[0.45rem] uppercase tracking-[0.2em] text-stone-600 px-4 pt-3 pb-1">Old Testament</p>
                {filteredOT.map(book => (
                  <button key={book.id} onClick={() => onSelectBook(book)}
                    className={`w-full text-left px-4 py-2 font-cormorant text-sm transition-colors border-l-2 ${
                      selectedBook?.id === book.id
                        ? 'text-stone-100 bg-amber-500/10 border-l-amber-500'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-white/4 border-l-transparent'
                    }`}
                  >
                    {book.name}
                    <span className="ml-1 font-coptic text-[0.45rem] text-stone-700">{book.numberOfChapters}ch</span>
                  </button>
                ))}
              </>
            )}
            {filteredNT.length > 0 && (
              <>
                <p className="font-coptic text-[0.45rem] uppercase tracking-[0.2em] text-stone-600 px-4 pt-4 pb-1">New Testament</p>
                {filteredNT.map(book => (
                  <button key={book.id} onClick={() => onSelectBook(book)}
                    className={`w-full text-left px-4 py-2 font-cormorant text-sm transition-colors border-l-2 ${
                      selectedBook?.id === book.id
                        ? 'text-stone-100 bg-amber-500/10 border-l-amber-500'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-white/4 border-l-transparent'
                    }`}
                  >
                    {book.name}
                    <span className="ml-1 font-coptic text-[0.45rem] text-stone-700">{book.numberOfChapters}ch</span>
                  </button>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

function BiblePage() {
  const navigate = useNavigate();

  // Store — only pull what BiblePage needs
  const stats        = useMemorizeStore(s => s.stats);
  const isVerseSaved = useMemorizeStore(s => s.isVerseSaved);
  const bookmarkVerse = useMemorizeStore(s => s.bookmarkVerse);
  const fetchStats   = useMemorizeStore(s => s.fetchStats);

  // Translation & books
  const [translations,   setTranslations]   = useState([]);
  const [translation,    setTranslation]     = useState(DEFAULT_TRANSLATION);
  const [books,          setBooks]           = useState([]);
  const [showTransDD,    setShowTransDD]     = useState(false);
  const [transSearch,    setTransSearch]     = useState('');

  // Navigation
  const [selectedBook,   setSelectedBook]    = useState(null);
  const [chapterNum,     setChapterNum]      = useState(1);
  const [chapterData,    setChapterData]     = useState(null);
  const [bookSearch,     setBookSearch]      = useState('');
  const [showBookPanel,  setShowBookPanel]   = useState(true);

  // UX
  const [loadingBooks,   setLoadingBooks]    = useState(false);
  const [loadingChapter, setLoadingChapter]  = useState(false);
  const [highlighted,    setHighlighted]     = useState(null);
  const [showFootnotes,  setShowFootnotes]   = useState(false);

  // Bookmark UX — local only, no need to store
  const [bookmarking, setBookmarking] = useState(null);
  const [toast,       setToast]       = useState({ message: '', type: '' });
  const toastTimer = useRef(null);
  const contentRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast({ message: '', type: '' }), 2800);
  }, []);

  // Fetch stats once for the due badge
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Fetch translations
  useEffect(() => {
    fetch(`${BASE}/available_translations.json`)
      .then(r => r.json())
      .then(d => setTranslations(d.translations.filter(t => t.language === 'eng')))
      .catch(() => {});
  }, []);

  // Fetch books when translation changes
  useEffect(() => {
    if (!translation) return;
    const controller = new AbortController();
    Promise.resolve().then(() => setLoadingBooks(true));
    fetch(`${BASE}/${translation}/books.json`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        setBooks(d.books);
        setSelectedBook(null);
        setChapterData(null);
        setLoadingBooks(false);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [translation]);

  // Fetch chapter
  useEffect(() => {
    if (!selectedBook) return;
    const controller = new AbortController();
    Promise.resolve().then(() => setLoadingChapter(true));
    fetch(`${BASE}/${translation}/${selectedBook.id}/${chapterNum}.json`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        setChapterData(d);
        setHighlighted(null);
        setLoadingChapter(false);
      })
      .catch(() => {});
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    return () => controller.abort();
  }, [selectedBook, chapterNum, translation]);

  // Bookmark handler — delegates entirely to store
  const handleBookmark = useCallback(async (verse) => {
    if (!selectedBook) return;
    setBookmarking(verse.number);
    const result = await bookmarkVerse({
      book_id:      selectedBook.id,
      book_name:    selectedBook.name,
      chapter:      chapterNum,
      verse_number: verse.number,
      translation,
      verse_text:   extractPlainText(verse.content),
    });
    setBookmarking(null);
    if (result.alreadyExists) {
      showToast(result.error, 'exists');
    } else if (result.success) {
      showToast(`${selectedBook.name} ${chapterNum}:${verse.number} saved`, 'success');
    } else {
      showToast('Could not save verse', 'error');
    }
  }, [selectedBook, chapterNum, translation, bookmarkVerse, showToast]);

  // Derived
  const footnotes   = chapterData?.chapter.footnotes ?? [];
  const prevChapter = chapterData?.previousChapterApiLink;
  const nextChapter = chapterData?.nextChapterApiLink;

  const goChapter = (dir) => {
    if (!selectedBook) return;
    const next = chapterNum + dir;
    if (next < selectedBook.firstChapterNumber || next > selectedBook.lastChapterNumber) return;
    setChapterNum(next);
  };

  const selectBook = (book) => {
    setSelectedBook(book);
    setChapterNum(book.firstChapterNumber);
    setShowBookPanel(false);
  };

  const filteredTranslations = translations.filter(t =>
    t.englishName.toLowerCase().includes(transSearch.toLowerCase()) ||
    t.shortName.toLowerCase().includes(transSearch.toLowerCase())
  );

  const chapterNums = selectedBook
    ? Array.from({ length: selectedBook.numberOfChapters }, (_, i) => i + selectedBook.firstChapterNumber)
    : [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <div className="flex flex-1 min-w-0 overflow-hidden relative">

        {/* DESKTOP book panel */}
        <aside className={`hidden lg:flex flex-col bg-[#0f0f0d] border-r border-white/6 h-screen overflow-hidden transition-all duration-300 ${showBookPanel ? 'w-56 shrink-0' : 'w-0'}`}>
          <div className="px-4 py-5 border-b border-white/6 shrink-0">
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Scripture</p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-100">Books</h2>
            <div className="w-5 h-0.5 bg-amber-500 mt-2" />
          </div>
          <BookList books={books} selectedBook={selectedBook} loadingBooks={loadingBooks}
            bookSearch={bookSearch} setBookSearch={setBookSearch} onSelectBook={selectBook} />
        </aside>

        {/* MOBILE drawer backdrop */}
        {showBookPanel && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowBookPanel(false)} />
        )}

        {/* MOBILE drawer */}
        <div className={`lg:hidden fixed z-50 bg-[#0f0f0d] flex flex-col transition-transform duration-300
          bottom-0 left-0 right-0 h-[75vh] rounded-t-2xl border-t border-white/10
          md:bottom-auto md:top-0 md:right-auto md:h-full md:w-72 md:rounded-none md:border-t-0 md:border-r md:border-white/6
          ${showBookPanel ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:-translate-x-full'}`}
        >
          <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
          <div className="px-4 py-4 border-b border-white/6 shrink-0 flex items-center justify-between">
            <div>
              <p className="font-coptic text-[0.5rem] uppercase tracking-[0.25em] text-stone-500 mb-0.5">Scripture</p>
              <h2 className="font-cormorant text-xl font-semibold text-stone-100">Books</h2>
              <div className="w-5 h-0.5 bg-amber-500 mt-1.5" />
            </div>
            <button onClick={() => setShowBookPanel(false)}
              className="p-1.5 text-stone-500 hover:text-stone-200 border border-white/10 hover:border-white/20 transition-colors"
            >
              <IconX />
            </button>
          </div>
          <BookList books={books} selectedBook={selectedBook} loadingBooks={loadingBooks}
            bookSearch={bookSearch} setBookSearch={setBookSearch} onSelectBook={selectBook} />
        </div>

        {/* Reading pane */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-3.5 border-b border-stone-200 bg-white shrink-0">
            <button onClick={() => setShowBookPanel(v => !v)}
              className="p-1.5 text-stone-400 hover:text-amber-500 border border-stone-200 hover:border-amber-300 transition-colors shrink-0"
            >
              <span className="lg:hidden"><IconMenu /></span>
              <span className="hidden lg:block"><IconBook /></span>
            </button>

            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {selectedBook ? (
                <>
                  <span className="font-cormorant text-base sm:text-lg font-semibold text-stone-800 truncate">{selectedBook.name}</span>
                  <span className="text-stone-300 shrink-0"><IconChevron dir="right" /></span>
                  <span className="font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 shrink-0">Ch. {chapterNum}</span>
                </>
              ) : (
                <span className="font-cormorant text-base sm:text-lg text-stone-400 truncate">Select a book to begin</span>
              )}
            </div>

            {/* Memorize nav button with due badge */}
            <button
              onClick={() => navigate('/plans/verses')}
              className="relative flex items-center gap-1.5 border border-stone-200 hover:border-amber-300 px-2.5 py-1.5 text-stone-400 hover:text-amber-600 transition-colors shrink-0"
            >
              <IconBrain />
              <span className="font-coptic text-[0.55rem] uppercase tracking-widest hidden sm:inline">Memorize</span>
              {stats?.due_today > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[0.5rem] font-bold flex items-center justify-center rounded-full">
                  {stats.due_today > 9 ? '9+' : stats.due_today}
                </span>
              )}
            </button>

            {/* Translation picker */}
            <div className="relative shrink-0">
              <button onClick={() => setShowTransDD(v => !v)}
                className="flex items-center gap-1.5 sm:gap-2 border border-stone-200 hover:border-amber-300 px-2 sm:px-3 py-1.5 transition-colors"
              >
                <span className="font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600">{translation}</span>
                <span className="text-stone-400"><IconChevron dir="down" /></span>
              </button>
              {showTransDD && (
                <div className="absolute right-0 top-full mt-1 w-64 sm:w-72 bg-white border border-stone-200 shadow-lg z-30 flex flex-col max-h-72 sm:max-h-80">
                  <div className="p-2 border-b border-stone-100">
                    <input autoFocus type="text" value={transSearch} onChange={e => setTransSearch(e.target.value)}
                      placeholder="Search translations…"
                      className="w-full text-xs border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-1.5 text-stone-700 placeholder:text-stone-300"
                    />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {filteredTranslations.slice(0, 40).map(t => (
                      <button key={t.id}
                        onClick={() => { setTranslation(t.id); setShowTransDD(false); setTransSearch(''); }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-amber-50 transition-colors border-b border-stone-50 ${t.id === translation ? 'bg-amber-50' : ''}`}
                      >
                        <span className="font-coptic text-[0.55rem] uppercase tracking-widest text-amber-600 block">{t.shortName}</span>
                        <span className="font-cormorant text-sm text-stone-700">{t.englishName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chapter nav strip */}
          {selectedBook && !loadingChapter && chapterData && (
            <div className="border-b border-stone-200 bg-stone-50 px-3 sm:px-5 py-2 shrink-0 overflow-x-auto">
              <div className="flex items-center gap-1">
                {chapterNums.map(n => (
                  <button key={n} onClick={() => setChapterNum(n)}
                    className={`w-7 h-7 text-xs font-cormorant transition-colors shrink-0 ${
                      n === chapterNum ? 'bg-amber-500 text-white' : 'text-stone-500 hover:bg-amber-100 hover:text-amber-700'
                    }`}
                  >{n}</button>
                ))}
              </div>
            </div>
          )}

          {/* Reading area */}
          <div ref={contentRef} className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 bg-[#faf8f3]">

            {!selectedBook && !loadingBooks && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div className="w-14 h-14 border border-stone-200 flex items-center justify-center text-stone-300"><IconBook /></div>
                <p className="font-cormorant text-2xl text-stone-400">Open a book to begin</p>
                <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">Choose from the books list</p>
                <button onClick={() => setShowBookPanel(true)}
                  className="mt-2 font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 border border-amber-200 hover:bg-amber-50 px-4 py-2 transition-colors"
                >Browse Books</button>
              </div>
            )}

            {loadingChapter && (
              <div className="flex items-center justify-center h-full gap-3">
                <div className="w-5 h-5 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">Loading…</p>
              </div>
            )}

            {chapterData && !loadingChapter && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6 sm:mb-8">
                  <p className="font-coptic text-[0.55rem] uppercase tracking-[0.25em] text-stone-400 mb-1">
                    {chapterData.translation.shortName} · {chapterData.book.name}
                  </p>
                  <h1 className="font-cormorant text-3xl sm:text-4xl font-light text-stone-800">
                    Chapter {chapterData.chapter.number}
                  </h1>
                  <div className="w-8 h-0.5 bg-amber-500 mt-3" />
                </div>

                <div className="space-y-1 text-stone-700">
                  {chapterData.chapter.content.map((item, i) => {
                    if (item.type === 'heading') return (
                      <h3 key={i} className="font-cormorant text-xl font-semibold text-stone-700 pt-6 pb-1">
                        {item.content.join(' ')}
                      </h3>
                    );
                    if (item.type === 'line_break') return <div key={i} className="h-2" />;
                    if (item.type === 'verse') return (
                      <VerseBlock
                        key={i}
                        verse={item}
                        highlighted={highlighted}
                        onHighlight={setHighlighted}
                        isSaved={isVerseSaved(selectedBook.id, chapterNum, item.number, translation)}
                        onBookmark={handleBookmark}
                        bookmarking={bookmarking}
                      />
                    );
                    if (item.type === 'hebrew_subtitle') return (
                      <p key={i} className="font-cormorant italic text-stone-500 text-sm mb-3 border-l-2 border-amber-300 pl-3">
                        {item.content.map(c => typeof c === 'string' ? c : c.text || '').join('')}
                      </p>
                    );
                    return null;
                  })}
                </div>

                {footnotes.length > 0 && (
                  <div className="mt-10 border-t border-stone-200 pt-5">
                    <button onClick={() => setShowFootnotes(v => !v)}
                      className="flex items-center gap-2 font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors mb-3"
                    >
                      <span className={`transition-transform ${showFootnotes ? 'rotate-90' : ''}`}><IconChevron /></span>
                      {footnotes.length} Footnote{footnotes.length !== 1 ? 's' : ''}
                    </button>
                    {showFootnotes && (
                      <div className="space-y-2">
                        {footnotes.map((fn, i) => (
                          <p key={i} className="text-xs text-stone-500 font-coptic leading-relaxed">
                            <sup className="text-amber-500 mr-1">[{fn.noteId + 1}]</sup>
                            {fn.reference && <span className="text-amber-600 mr-1">{fn.reference.chapter}:{fn.reference.verse}</span>}
                            {fn.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-10 sm:mt-12 pt-6 border-t border-stone-200">
                  <button onClick={() => goChapter(-1)} disabled={!prevChapter}
                    className="flex items-center gap-2 font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-amber-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-stone-200 hover:border-amber-300 disabled:hover:border-stone-200 px-3 sm:px-4 py-2"
                  >
                    <IconChevron dir="left" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <span className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-300">
                    {chapterData.book.name} {chapterNum}
                  </span>
                  <button onClick={() => goChapter(1)} disabled={!nextChapter}
                    className="flex items-center gap-2 font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-amber-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-stone-200 hover:border-amber-300 disabled:hover:border-stone-200 px-3 sm:px-4 py-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <IconChevron dir="right" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTransDD && <div className="fixed inset-0 z-20" onClick={() => setShowTransDD(false)} />}
      <BookmarkToast message={toast.message} type={toast.type} />
    </div>
  );
}

export default BiblePage;