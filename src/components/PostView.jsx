import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

const LEADER_GROUPS = ["Leader", "Pastor", "Head Pastor", "Jr Leader", "Staff"];

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconHeart = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const IconComment = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconX = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isLeader(user) {
  return user?.groups?.some((g) => LEADER_GROUPS.includes(g));
}

// ── Comment Item ──────────────────────────────────────────────────────────────

function CommentItem({ comment, currentUser, postAuthorId, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAuthor  = currentUser?.id === comment.author?.id;
  const canModify = isAuthor || currentUser?.id === postAuthorId || isLeader(currentUser);

  return (
    <div className="flex gap-3 group">
      <img
        src={comment.author_profile?.profile_pic_url || "/images/defaultavatar.jpg"}
        alt={comment.author?.username}
        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-200 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
            @{comment.author?.username}
          </span>
          <span className="text-[0.6rem] text-stone-300">{timeAgo(comment.created_at)}</span>
          {isAuthor && (
            <span className="text-[0.55rem] uppercase tracking-widest text-amber-500/70">you</span>
          )}
        </div>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">{comment.text}</p>
      </div>

      {/* Actions — visible on hover if user can modify */}
      {canModify && (
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
          {!confirmDelete ? (
            <>
              {isAuthor && (
                <button
                  onClick={() => onEdit(comment)}
                  className="p-1 text-stone-400 hover:text-amber-500 transition-colors"
                  title="Edit"
                >
                  <IconEdit />
                </button>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <IconTrash />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1">
              <span className="font-coptic text-[0.55rem] text-red-500 uppercase tracking-widest">Delete?</span>
              <button
                onClick={() => { onDelete(comment.id); setConfirmDelete(false); }}
                className="p-0.5 text-red-500 hover:text-red-700"
              >
                <IconCheck />
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="p-0.5 text-stone-400 hover:text-stone-600"
              >
                <IconX />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function PostView() {
  const { postId } = useParams();
  const navigate   = useNavigate();

  const currentUser = useAuthStore((state) => state.user);
  const token       = useAuthStore((state) => state.token);

  const fetchPost         = useMainStore((state) => state.fetchPost);
  const fetchPostComments = useMainStore((state) => state.fetchPostComments);
  const toggleLike        = useMainStore((state) => state.toggleLike);
  const addComment        = useMainStore((state) => state.addComment);
  const editComment       = useMainStore((state) => state.editComment);
  const deleteComment     = useMainStore((state) => state.deleteComment);
  const deletePost        = useMainStore((state) => state.deletePost);

  const [post,       setPost]       = useState(null);
  const [comments,   setComments]   = useState([]);
  const [postLoading, setPostLoading] = useState(true);

  // Comment form
  const [commentText,  setCommentText]  = useState("");
  const [submitting,   setSubmitting]   = useState(false);

  // Edit comment
  const [editingComment, setEditingComment] = useState(null); // { id, content }
  const [editText,       setEditText]       = useState("");

  // Delete post confirm
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);

  useEffect(() => {
    if (!postId || !token) return;
    (async () => {
      setPostLoading(true);
      const [p, c] = await Promise.all([
        fetchPost(postId),
        fetchPostComments(postId),
      ]);
      setPost(p);
      setComments(c);
      setPostLoading(false);
    })();
  }, [postId, token, fetchPost, fetchPostComments]);

  const handleLike = async () => {
    if (!token) return;
    await toggleLike(post.id, token);
    setPost((p) => ({ ...p, like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1, is_liked: !p.is_liked }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    const result = await addComment(post.id, commentText.trim());
    setSubmitting(false);
    if (result?.success) {
      setComments((prev) => [...prev, result.comment]);
      setPost((p) => ({ ...p, comment_count: (p.comment_count ?? 0) + 1 }));
      setCommentText("");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingComment(comment);
    setEditText(comment.text);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || !editingComment) return;
    const result = await editComment(editingComment.id, editText.trim());
    if (result?.success) {
      setComments((prev) =>
        prev.map((c) => c.id === editingComment.id ? { ...c, text: result.comment.text } : c)
      );
      setEditingComment(null);
      setEditText("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await deleteComment(commentId, post.id);
    if (result?.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setPost((p) => ({ ...p, comment_count: Math.max(0, (p.comment_count ?? 1) - 1) }));
    }
  };

  const handleDeletePost = async () => {
    const result = await deletePost(post.id);
    if (result?.success) navigate(-1);
  };

  const isPostAuthor = currentUser?.id === post?.author?.id;
  const canDeletePost = isPostAuthor || isLeader(currentUser);

  if (postLoading) return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
      <p className="text-xs uppercase tracking-[0.25em] text-stone-400 animate-pulse">Loading…</p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col items-center justify-center gap-4">
      <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Post not found</p>
      <button onClick={() => navigate(-1)} className="font-coptic text-[0.6rem] uppercase tracking-widest text-amber-500 hover:text-amber-600">
        Go back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#faf8f3]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ── Back nav ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors mb-8"
        >
          <IconBack /> Back
        </button>

        {/* ── Post ── */}
        <article className="mb-10">

          {/* Author row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img
                src={post.author_profile?.profile_pic_url || "/images/defaultavatar.jpg"}
                alt={post.author?.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20"
              />
              <div>
                <p className="font-cormorant text-base font-semibold text-stone-700 leading-tight">
                  {post.author?.first_name && post.author?.last_name
                    ? `${post.author.first_name} ${post.author.last_name}`
                    : post.author?.username}
                </p>
                <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">
                  @{post.author?.username} · {timeAgo(post.published_date)}
                </p>
              </div>
            </div>

            {/* Post actions */}
            {canDeletePost && (
              <div className="flex items-center gap-1">
                {isPostAuthor && (
                  <Link
                    to={`/feed/edit/${post.id}`}
                    className="p-2 text-stone-400 hover:text-amber-500 transition-colors"
                    title="Edit post"
                  >
                    <IconEdit />
                  </Link>
                )}
                {!confirmDeletePost ? (
                  <button
                    onClick={() => setConfirmDeletePost(true)}
                    className="p-2 text-stone-400 hover:text-red-400 transition-colors"
                    title="Delete post"
                  >
                    <IconTrash />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1">
                    <span className="font-coptic text-[0.55rem] text-red-500 uppercase tracking-widest">Delete post?</span>
                    <button onClick={handleDeletePost} className="p-0.5 text-red-500 hover:text-red-700"><IconCheck /></button>
                    <button onClick={() => setConfirmDeletePost(false)} className="p-0.5 text-stone-400 hover:text-stone-600"><IconX /></button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="font-cormorant text-3xl font-semibold text-stone-800 leading-snug mb-4">
            {post.title}
          </h1>

          {/* Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-96 object-cover mb-5"
            />
          )}

          {/* Content */}
          <p className="text-sm text-stone-500 leading-relaxed mb-6">{post.text}</p>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span key={`${tag}-${i}`} className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Like + comment counts */}
          <div className="flex items-center gap-5 pt-4 border-t border-stone-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                post.is_liked ? "text-amber-500" : "text-stone-400 hover:text-amber-500"
              }`}
            >
              <IconHeart filled={post.is_liked} />
              <span className="text-xs tabular-nums">{post.like_count}</span>
            </button>
            <div className="flex items-center gap-1.5 text-stone-400">
              <IconComment />
              <span className="text-xs tabular-nums">{comments.length}</span>
            </div>
          </div>
        </article>

        {/* ── Comments ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-cormorant text-2xl font-semibold text-stone-800 shrink-0">Comments</h2>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Add comment form */}
          <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
            <img
              src={currentUser?.profile?.profile_pic_url || "/images/defaultavatar.jpg"}
              alt="You"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-200 mt-1"
            />
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                rows={2}
                className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none w-full"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.6rem] uppercase tracking-widest px-4 py-2 transition-colors"
                >
                  {submitting ? <span className="animate-pulse">Posting…</span> : "Post"}
                </button>
              </div>
            </div>
          </form>

          {/* Edit comment form */}
          {editingComment && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200">
              <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 mb-2">
                Editing comment
              </p>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="bg-white border border-amber-300 focus:border-amber-500 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors resize-none w-full mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editText.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.6rem] uppercase tracking-widest px-4 py-2 transition-colors flex items-center gap-1.5"
                >
                  <IconCheck /> Save
                </button>
                <button
                  onClick={() => { setEditingComment(null); setEditText(""); }}
                  className="border border-stone-200 text-stone-500 hover:border-stone-400 font-coptic text-[0.6rem] uppercase tracking-widest px-4 py-2 transition-colors flex items-center gap-1.5"
                >
                  <IconX /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Comment list */}
          <div className="flex flex-col gap-5">
            {comments.length > 0 ? (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                    postAuthorId={post.author?.id}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center py-12 gap-3">
                <div className="w-8 h-px bg-amber-500/40" />
                <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                  No comments yet — be the first
                </p>
                <div className="w-8 h-px bg-amber-500/40" />
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default PostView;