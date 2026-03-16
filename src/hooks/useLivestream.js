import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const YT_API_KEY     = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_HANDLE = 'MavunoChurchHillCity';
const POLL_INTERVAL  = 2 * 60 * 1000; // check live status every 2 minutes

// Session cache keys
const CACHE_CHANNEL_ID   = 'yt_channel_id';
const CACHE_LATEST_VIDEO = 'yt_latest_video';
const CACHE_LATEST_TTL   = 'yt_latest_video_ttl';
const LATEST_VIDEO_TTL   = 60 * 60 * 1000; // re-fetch latest video once per hour

// ---------------------------------------------------------------------------
// Schedule helpers (EAT = UTC+3)
// ---------------------------------------------------------------------------

function getEATNow() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 60 * 60000);
}

function isScheduledWindow() {
  const eat  = getEATNow();
  const day  = eat.getDay();
  const mins = eat.getHours() * 60 + eat.getMinutes();
  return (day === 0 && mins >= 510 && mins <= 660)
      || (day === 0 && mins >= 630 && mins <= 810);
}

function getNextService() {
  const eat  = getEATNow();
  const day  = eat.getDay();
  const mins = eat.getHours() * 60 + eat.getMinutes();
  const next = new Date(eat);

  if (day === 0 && mins < 510)  { next.setHours(9,  0, 0, 0); return next; }
  if (day === 0 && mins < 630)  { next.setHours(11, 0, 0, 0); return next; }

  const daysUntilSunday = day === 0 ? 7 : (7 - day) % 7;
  next.setDate(eat.getDate() + daysUntilSunday);
  next.setHours(9, 0, 0, 0);
  return next;
}

// ---------------------------------------------------------------------------
// YouTube API helpers
// ---------------------------------------------------------------------------

async function resolveChannelId() {
  const cached = sessionStorage.getItem(CACHE_CHANNEL_ID);
  if (cached) return cached;

  const res  = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${CHANNEL_HANDLE}&key=${YT_API_KEY}`
  );
  const data = await res.json();
  const id   = data?.items?.[0]?.id ?? null;
  if (id) sessionStorage.setItem(CACHE_CHANNEL_ID, id);
  return id;
}

// Uses the search endpoint (100 units) -- only called during scheduled windows
// or when midweekOverride is active.
async function fetchLiveVideoId(channelId) {
  const res  = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${YT_API_KEY}`
  );
  const data = await res.json();
  return data?.items?.[0]?.id?.videoId ?? null;
}

// Uses the search endpoint (100 units) -- cached for 1 hour so it only fires
// once per session rather than every 2 minutes.
async function fetchLatestVideo(channelId) {
  const now    = Date.now();
  const cached = sessionStorage.getItem(CACHE_LATEST_VIDEO);
  const ttl    = Number(sessionStorage.getItem(CACHE_LATEST_TTL) ?? 0);

  if (cached && now < ttl) {
    return JSON.parse(cached);
  }

  const res  = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${YT_API_KEY}`
  );
  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) return null;

  const video = {
    videoId:     item.id.videoId,
    title:       item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnail:   item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
  };

  sessionStorage.setItem(CACHE_LATEST_VIDEO, JSON.stringify(video));
  sessionStorage.setItem(CACHE_LATEST_TTL,   String(now + LATEST_VIDEO_TTL));
  return video;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLiveStream() {
  const [state, setState] = useState({
    status:          'loading',
    videoId:         null,
    latestVideo:     null,
    nextService:     null,
    midweekOverride: false,
  });

  const check = useCallback(async (channelId, midweekOverride) => {
    const shouldCheckLive = isScheduledWindow() || midweekOverride;

    try {
      // fetchLatestVideo is cached -- won't hit the API more than once per hour.
      // fetchLiveVideoId only runs during service windows or midweek override.
      const [liveVideoId, latestVideo] = await Promise.all([
        shouldCheckLive ? fetchLiveVideoId(channelId) : Promise.resolve(null),
        fetchLatestVideo(channelId),
      ]);

      setState(s => ({
        ...s,
        status:      liveVideoId ? 'live' : 'offline',
        videoId:     liveVideoId,
        latestVideo,
        nextService: liveVideoId ? null : getNextService(),
      }));
    } catch {
      setState(s => ({
        ...s,
        status:      'offline',
        nextService: getNextService(),
      }));
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

      // Poll for live status only -- latest video is cached so this is cheap
      // outside of service windows (fetchLiveVideoId won't fire unless the
      // schedule or midweekOverride says it should).
      interval = setInterval(async () => {
        const snap            = await getDoc(doc(db, 'streams', 'config'));
        const midweekOverride = snap.exists() ? !!snap.data().midweekOverride : false;
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