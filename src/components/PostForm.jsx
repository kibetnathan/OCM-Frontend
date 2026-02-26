import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";

function PostForm() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const token = useAuthStore((state) => state.token);
  const uploadPost = useMainStore((state) => state.uploadPost);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("tags", tags);
    if (image) {
      formData.append("image", image);
    }
    try {
      await uploadPost(formData, token);
      navigate("/feed/");
    } catch (err) {
      console.error("Failed to upload:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#faf8f3]">

      {/* ── Left panel — decorative image ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden bg-[#0f0f0d]">
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=900&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0d] via-transparent to-transparent" />

        {/* Bottom text */}
        <div className="relative z-10 p-10 mt-auto">
          <div className="w-8 h-px bg-amber-500 mb-4" />
          <p className="font-cormorant text-3xl font-light text-stone-100 leading-snug">
            Share what's on your heart with the community.
          </p>
          <p className="font-coptic text-xs tracking-widest text-stone-500 mt-3 uppercase">
            Open Church Management
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-col flex-1 px-10 py-10 overflow-y-auto">

        {/* Back link */}
        <Link
          to="/feed/"
          className="flex items-center gap-2 text-xs font-coptic tracking-widest uppercase text-stone-400 hover:text-amber-500 transition-colors w-fit mb-10"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Feed
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">New post</p>
          <h2 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">
            Create a Post
          </h2>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg">

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="font-coptic text-xs uppercase tracking-widest text-stone-500">
              Post Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-coptic file:uppercase file:tracking-widest file:bg-amber-500 file:text-white hover:file:bg-amber-600 file:transition-colors file:cursor-pointer bg-stone-100 border border-stone-200 w-full py-2 px-3"
            />
            <p className="text-[0.6rem] tracking-wider text-stone-400 uppercase">Max size 2MB</p>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="font-coptic text-xs uppercase tracking-widest text-stone-500">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 font-light transition-colors"
              placeholder="What is your post about?"
              required
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <label className="font-coptic text-xs uppercase tracking-widest text-stone-500">
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 font-light transition-colors resize-none min-h-36"
              placeholder="Write your post..."
              required
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="font-coptic text-xs uppercase tracking-widest text-stone-500">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 font-light transition-colors"
              placeholder="e.g. worship, announcements, prayer"
              required
            />
            <p className="text-[0.6rem] tracking-wider text-stone-400 uppercase">Separate tags with commas</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-xs uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center gap-2 group"
          >
            Publish Post
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

        </form>
      </div>
    </div>
  );
}

export default PostForm;