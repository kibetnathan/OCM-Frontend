import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 

const YT_API_KEY   = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_HANDLE = 'MavunoChurchHillCity';
const POLL_INTERVAL  = 2 * 60 * 1000; // check every 2 minutes

// ---------------------------------------------------------------------------
// Schedule helpers (EAT = UTC+3)
// ---------------------------------------------------------------------------

function getEATNow() {
  const now = new Date();
  const eatOffset = 3 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + eatOffset * 60000);
}

function isScheduledWindow() {
  const eat = getEATNow();
  const day  = eat.getDay(); 
  const mins = eat.getHours() * 60 + eat.getMinutes();

  const sunday9am  = day === 0 && mins >= 510  && mins <= 660;  
  const sunday11am = day === 0 && mins >= 630  && mins <= 810;  
  return sunday9am || sunday11am;
}

function getNextService() {
  const eat = getEATNow();
  const day  = eat.getDay();
  const mins = eat.getHours() * 60 + eat.getMinutes();


  const daysUntilSunday = (7 - day) % 7 || (mins >= 660 ? 7 : 0);
  const nextSunday = new Date(eat);
  nextSunday.setDate(eat.getDate() + daysUntilSunday);
  nextSunday.setHours(9, 0, 0, 0);

  if (day === 0 && mins < 510) {
    nextSunday.setDate(eat.getDate());
    nextSunday.setHours(9, 0, 0, 0);
  }
  if (day === 0 && mins >= 660 && mins < 630) {
    nextSunday.setDate(eat.getDate());
    nextSunday.setHours(11, 0, 0, 0);
  }

  return nextSunday;
}

// ---------------------------------------------------------------------------
// YouTube API helpers
// ---------------------------------------------------------------------------

async function resolveChannelId() {
  const cached = sessionStorage.getItem('yt_channel_id');
  if (cached) return cached;

  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${CHANNEL_HANDLE}&key=${YT_API_KEY}`;
  const res  = await fetch(url);
  const data = await res.json();
  const id   = data?.items?.[0]?.id ?? null;
  if (id) sessionStorage.setItem('yt_channel_id', id);
  return id;
}

async function fetchLiveVideoId(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${YT_API_KEY}`;
  const res  = await fetch(url);
  const data = await res.json();
  return data?.items?.[0]?.id?.videoId ?? null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLiveStream() {
  const [state, setState] = useState({
    status: 'loading',   // 'loading' | 'live' | 'offline'
    videoId: null,
    nextService: null,
    midweekOverride: false,
  });

  const check = useCallback(async (channelId, midweekOverride) => {
    // Only hit the API if we're in a scheduled window OR midweek override is on
    const shouldCheck = isScheduledWindow() || midweekOverride;

    if (!shouldCheck) {
      setState(s => ({
        ...s,
        status: 'offline',
        videoId: null,
        nextService: getNextService(),
      }));
      return;
    }

    try {
      const videoId = await fetchLiveVideoId(channelId);
      setState(s => ({
        ...s,
        status: videoId ? 'live' : 'offline',
        videoId,
        nextService: videoId ? null : getNextService(),
      }));
    } catch {
      setState(s => ({ ...s, status: 'offline', nextService: getNextService() }));
    }
  }, []);

  useEffect(() => {
    let channelId   = null;
    let interval    = null;
    let unsubscribe = null;

    async function init() {
      channelId = await resolveChannelId();
      if (!channelId) {
        setState(s => ({ ...s, status: 'offline', nextService: getNextService() }));
        return;
      }

      const configRef = doc(db, 'streams', 'config');
      unsubscribe = onSnapshot(configRef, async (snap) => {
        const midweekOverride = snap.exists() ? !!snap.data().midweekOverride : false;
        setState(s => ({ ...s, midweekOverride }));
        await check(channelId, midweekOverride);
      });

      interval = setInterval(async () => {
        const configSnap = await import('firebase/firestore').then(({ getDoc }) =>
          getDoc(doc(db, 'streams', 'config'))
        );
        const midweekOverride = configSnap.exists() ? !!configSnap.data().midweekOverride : false;
        check(channelId, midweekOverride);
      }, POLL_INTERVAL);
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
      if (interval)    clearInterval(interval);
    };
  }, [check]);

  return state;
}