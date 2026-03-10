import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';

const BASE = 'https://bible.helloao.org/api';
const DEFAULT_TRANSLATION = 'BSB';

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

  useEffect(() => {
    fetch(`${BASE}/available_translations.json`)
      .then(r => r.json())
      .then(d => setTranslations(d.translations.filter(t => t.language === 'eng')))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!translation) return;
    const controller = new AbortController();
    fetch(`${BASE}/${translation}/books.json`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        setBooks(d.books);
        setSelectedBook(null);
        setChapterData(null);
        setLoadingBooks(false);
      })
      .catch(() => {});
    Promise.resolve().then(() => setLoadingBooks(true));
    return () => controller.abort();
  }, [translation]);

  useEffect(() => {
    if (!selectedBook) return;
    const controller = new AbortController();
    fetch(`${BASE}/${translation}/${selectedBook.id}/${chapterNum}.json`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        setChapterData(d);
        setHighlighted(null);
        setLoadingChapter(false);
      })
      .catch(() => {});
    Promise.resolve().then(() => setLoadingChapter(true));
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    return () => controller.abort();
  }, [selectedBook, chapterNum, translation]);

  const filteredBooks = books.filter(b => b.name.toLowerCase().includes(bookSearch.toLowerCase()));
  const filteredOT    = filteredBooks.filter(b => b.order <= 39);
  const filteredNT    = filteredBooks.filter(b => b.order > 39);

  const footnotes   = chapterData?.chapter.footnotes ?? [];
  const prevChapter = chapterData?.previousChapterApiLink;
  const nextChapter = chapterData?.nextChapterApiLink;

  const chapterNums = selectedBook
    ? Array.from({ length: selectedBook.numberOfChapters }, (_, i) => i + selectedBook.firstChapterNumber)
    : [];

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

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <div className="flex flex-1 min-w-0 overflow-hidden">

        {/* ── Left: Book selector panel ── */}
        <aside className={`flex flex-col bg-[#0f0f0d] border-r border-white/6 h-screen overflow-hidden transition-all duration-300 ${showBookPanel ? 'w-56 shrink-0' : 'w-0 overflow-hidden'}`}>
          <div className="px-4 py-5 border-b border-white/6 shrink-0">
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Scripture</p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-100">Books</h2>
            <div className="w-5 h-0.5 bg-amber-500 mt-2" />
          </div>

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
                      <button
                        key={book.id}
                        onClick={() => selectBook(book)}
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
                      <button
                        key={book.id}
                        onClick={() => selectBook(book)}
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
        </aside>

        {/* centre pane placeholder */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden" />

      </div>
    </div>
  );
}

export default BiblePage;