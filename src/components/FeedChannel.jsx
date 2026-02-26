import { React, useEffect } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";
import useProfileStore from "../zustand/profileStore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function FeedChannel() {
  const token = useAuthStore((state) => state.token);
  const posts = useMainStore((state) => state.posts?.results) || [];
  useEffect(() => {
    if (token) useProfileStore.getState().fetchProfile();
  }, [token]);
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const fetchPosts = useMainStore((state) => state.fetchPosts);
  const toggleLike = useMainStore((state) => state.toggleLike);
  const onLikeClick = (postId) => {
    if (!token) {
      alert("Please log in to like posts!");
      return;
    }
    toggleLike(postId, token);
  };
  useEffect(() => {
    if (token) {
      fetchPosts(token);
    }
  }, [token, fetchPosts]);

  return (
    <div className="w-full min-h-screen bg-[#faf8f3]">

      {/* ── Tab Bar ── */}
      <ul className="flex flex-row border-b border-stone-200 px-6">
        <li className="font-cormorant text-xl text-stone-800 px-5 py-4 border-b-2 border-amber-500 hover:cursor-pointer">
          Top Posts
        </li>
        <li className="font-cormorant text-xl text-stone-400 px-5 py-4 border-b-2 border-transparent hover:text-stone-700 hover:cursor-pointer transition-colors">
          My Groups
        </li>
      </ul>

      {/* ── Compose Row ── */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-stone-200 bg-[#faf8f3]">
        <img
          src={profile?.profile_pic || "/images/defaultavatar.jpg"}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30 shrink-0"
        />
        <div className="flex-1">
          <p className="font-coptic text-xs text-stone-400 tracking-widest">
            @{user?.username}
          </p>
          <p className="font-cormorant text-lg text-stone-500 leading-tight">
            What's new? Let everyone know with a post!
          </p>
        </div>
        <Link
          to="upload"
          className="flex items-center justify-center w-9 h-9 bg-amber-500 hover:bg-amber-600 transition-colors rounded-sm shrink-0"
        >
          <AddIcon className="text-white" fontSize="small" />
        </Link>
      </div>

      {/* ── Posts Feed ── */}
      <div className="flex flex-col">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 px-6 py-8 border-b border-stone-200 hover:bg-stone-50/60 transition-colors"
            >
              {/* Author row */}
              <div className="flex items-center gap-3">
                <img
                  src={post.author_profile.profile_pic || "/images/defaultavatar.jpg"}
                  alt={post.author.username}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-500/20"
                />
                <div>
                  <p className="font-coptic text-xs text-stone-500 tracking-wider">
                    @{post.author.username}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-cormorant text-2xl font-semibold text-stone-800 leading-snug">
                {post.title}
              </h3>

              {/* Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-72 object-cover rounded-sm"
                />
              )}

              {/* Content */}
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-1">
                <button
                  onClick={() => onLikeClick(post.id)}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-amber-500 transition-colors group"
                >
                  <FavoriteBorderIcon fontSize="small" className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs tabular-nums">{post.like_count}</span>
                </button>
                <button className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 transition-colors">
                  <CommentIcon fontSize="small" />
                  <span className="text-xs tabular-nums">{post.comment_count}</span>
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-px bg-amber-500/40" />
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
              No posts yet
            </p>
            <div className="w-8 h-px bg-amber-500/40" />
          </div>
        )}
      </div>

    </div>
  );
}

export default FeedChannel;