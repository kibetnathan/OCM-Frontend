import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";
import useProfileStore from "../zustand/profileStore";

// ── Small reusable pieces ─────────────────────────────────────────────────────

function StatCard({ label, count, icon }) {
  return (
    <div className="relative overflow-hidden flex flex-col justify-between rounded-sm p-6 bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <span className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500">{label}</span>
        <span className="text-stone-600">{icon}</span>
      </div>
      <p className="font-cormorant text-5xl font-light text-stone-100 leading-none relative z-10">
        {count != null
          ? count
          : <span className="text-stone-600 text-2xl animate-pulse">—</span>}
      </p>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="font-cormorant text-2xl font-semibold text-stone-800 shrink-0">{children}</h2>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);
const IconGrid = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
const IconBuilding = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
const IconStar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);
const IconBook = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const IconHeart = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const IconArrow = () => (
  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────

function DashboardOverview() {
  const token    = useAuthStore((state) => state.token);
  const user     = useAuthStore((state) => state.user);
  const profile  = useProfileStore((state) => state.profile);

  // Correctly named state keys from mainStore.js
  const posts           = useMainStore((state) =>
    state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : [])
  );
  const fellowships     = useMainStore((state) => state.fellowships);      // plain array
  const courses         = useMainStore((state) => state.courses);          // plain array
  const departments     = useMainStore((state) => state.departments);      // plain array
  const services        = useMainStore((state) => state.services);         // plain array
  const leadership_teams = useMainStore((state) => state.leadership_teams); // plain array

  // Correctly named actions from mainStore.js
  const fetchPosts           = useMainStore((state) => state.fetchPosts);
  const fetchFellowships     = useMainStore((state) => state.fetchFellowships);
  const fetchCourses         = useMainStore((state) => state.fetchCourses);
  const fetchDepartments     = useMainStore((state) => state.fetchDepartments);
  const fetchServices        = useMainStore((state) => state.fetchServices);
  const fetchLeadershipTeams = useMainStore((state) => state.fetchLeadershipTeams);
  const uploadPost           = useMainStore((state) => state.uploadPost);

  // Quick-post form state
  const [title,     setTitle]     = useState("");
  const [text,      setText]      = useState("");
  const [tags,      setTags]      = useState("");
  const [image,     setImage]     = useState(null);
  const [posting,   setPosting]   = useState(false);
  const [posted,    setPosted]    = useState(false);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    if (!token) return;
    useProfileStore.getState().fetchProfile();
    fetchPosts(token);      // fetchPosts takes token as argument
    fetchFellowships();
    fetchCourses();
    fetchDepartments();
    fetchServices();
    fetchLeadershipTeams();
  }, [token]);

  const handleQuickPost = async (e) => {
    e.preventDefault();
    if (!token) return;
    setPostError(null);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("tags", tags);
    if (image) formData.append("image", image);
    setPosting(true);
    try {
      await uploadPost(formData, token);
      setTitle(""); setText(""); setTags(""); setImage(null);
      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
    } catch {
      setPostError("Failed to publish. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const topPosts = [...posts]
    .sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0))
    .slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : user?.username ?? "Pastor";

  return (
    <div className="min-h-screen bg-[#faf8f3] p-8">

      {/* ── Page header ── */}
      <div className="mb-10">
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">{greeting()},</p>
        <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">{displayName}</h1>
        <div className="w-8 h-0.5 bg-amber-500 mt-3" />
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        <StatCard label="Fellowships"  count={fellowships.count}  icon={<IconUsers />}    />
        <StatCard label="Courses"      count={courses.count}      icon={<IconBook />}     />
        <StatCard label="Departments"  count={departments.count}  icon={<IconBuilding />} />
        <StatCard label="Services"     count={services.count}     icon={<IconStar />}     />
      </div>

      {/* ── Two-column body ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left 2/3 */}
        <div className="xl:col-span-2 flex flex-col gap-10">

          {/* Leadership Teams */}
          <section>
            <SectionHeading>Leadership</SectionHeading>
            {leadership_teams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leadership_teams.map((team) => (
                  <div
                    key={team.id}
                    className="relative overflow-hidden flex items-center gap-4 bg-[#0f0f0d]/65 backdrop-blur-md border border-white/10 px-4 py-3 rounded-sm shadow-md shadow-black/10 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber-500/8 rounded-full blur-xl pointer-events-none" />
                    {/* Letter avatar */}
                    <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                      <span className="font-cormorant text-lg font-semibold text-amber-400 leading-none">
                        {team.name?.charAt(0) ?? "L"}
                      </span>
                    </div>
                    <div className="min-w-0 relative z-10">
                      <p className="font-cormorant text-base font-semibold text-stone-100 leading-tight truncate">
                        {team.name ?? "Leadership Team"}
                      </p>
                      {team.description && (
                        <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500 truncate mt-0.5">
                          {team.description}
                        </p>
                      )}
                      {Array.isArray(team.members) && (
                        <p className="text-[0.6rem] text-stone-600 mt-0.5">
                          {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs uppercase tracking-widest text-stone-300">No leadership teams found</p>
            )}
          </section>

          {/* Top 5 Posts */}
          <section>
            <SectionHeading>Top Posts</SectionHeading>
            {topPosts.length > 0 ? (
              <div className="flex flex-col divide-y divide-stone-100 border border-stone-100 bg-white">
                {topPosts.map((post, i) => (
                  <div key={post.id} className="flex items-start gap-4 px-5 py-4 hover:bg-stone-50 transition-colors">
                    <span className="font-cormorant text-3xl font-light text-stone-200 leading-none w-7 shrink-0 pt-0.5">
                      {i + 1}
                    </span>
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-14 h-14 object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-cormorant text-lg font-semibold text-stone-800 leading-tight truncate">
                        {post.title}
                      </p>
                      <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 mt-0.5">
                        @{post.author?.username}
                      </p>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">{post.content}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 shrink-0 pt-1">
                      <IconHeart />
                      <span className="text-xs tabular-nums font-medium">{post.like_count ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs uppercase tracking-widest text-stone-300">No posts yet</p>
            )}
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 mt-3 text-[0.65rem] uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-colors group"
            >
              View all posts <IconArrow />
            </Link>
          </section>
        </div>

        {/* Right 1/3 — Quick Post */}
        <div className="xl:col-span-1">
          <SectionHeading>Quick Post</SectionHeading>
          <form
            onSubmit={handleQuickPost}
            className="relative overflow-hidden bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-4"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

            {/* Author strip */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07] relative z-10">
              <img
                src={profile?.profile_pic || "/images/defaultavatar.jpg"}
                alt="you"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/30"
              />
              <div>
                <p className="font-cormorant text-sm font-semibold text-stone-200 leading-none">
                  {user?.first_name || user?.username}
                </p>
                <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500">
                  @{user?.username}
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1 relative z-10">
              <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">Title</label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                required placeholder="Post title…"
                className="bg-white/5 border border-white/10 focus:border-amber-400/60 focus:outline-none px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 transition-colors rounded-sm"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 relative z-10">
              <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">Content</label>
              <textarea
                value={text} onChange={(e) => setText(e.target.value)}
                required placeholder="What's on your heart?"
                className="bg-white/5 border border-white/10 focus:border-amber-400/60 focus:outline-none px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 transition-colors resize-none min-h-24 rounded-sm"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1 relative z-10">
              <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">Tags</label>
              <input
                type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                required placeholder="worship, prayer…"
                className="bg-white/5 border border-white/10 focus:border-amber-400/60 focus:outline-none px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 transition-colors rounded-sm"
              />
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1 relative z-10">
              <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
                Image <span className="text-stone-600 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
                className="text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-[0.6rem] file:font-coptic file:uppercase file:tracking-widest file:bg-stone-700 file:text-stone-200 hover:file:bg-stone-600 file:transition-colors file:cursor-pointer file:rounded-sm"
              />
            </div>

            {/* Error */}
            {postError && (
              <p className="text-[0.6rem] uppercase tracking-widest text-red-400 relative z-10">{postError}</p>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={posting}
              className="mt-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2 group rounded-sm relative z-10"
            >
              {posting ? (
                <span className="animate-pulse">Publishing…</span>
              ) : posted ? "Posted ✓" : (
                <><span>Publish Post</span><IconArrow /></>
              )}
            </button>

            {posted && (
              <p className="text-[0.6rem] uppercase tracking-widest text-amber-400 text-center animate-pulse relative z-10">
                Published successfully
              </p>
            )}

            <Link
              to="/feed/upload"
              className="text-[0.6rem] uppercase tracking-widest text-stone-600 hover:text-amber-500 text-center transition-colors relative z-10"
            >
              Full post editor →
            </Link>
          </form>
        </div>

      </div>
    </div>
  );
}

export default DashboardOverview;