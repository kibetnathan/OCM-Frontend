import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";

function PostForm() {
  const [image, setImage] = useState(null); // Changed to null for file object
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  
  const token = useAuthStore((state) => state.token);
  const uploadPost = useMainStore((state) => state.uploadPost); // Specific action
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FormData is required for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("tags", tags)
    if (image) {
      formData.append("image", image);
    }

    try {
      await uploadPost(formData, token);
    //   navigate("/feed/"); // Redirect after success
    } catch (err) {
      console.error("Failed to upload:", err);
    }
  };

  return (
    <div className="flex flex-col bg-light w-full min-h-screen p-10 items-center">
      <Link
        to={"/feed/"}
        className="relative -left-85 bg-amber-600 text-stone-800 font-coptic px-5 py-2 text-2xl h-fit w-fit"
      >
        &lt;- Back
      </Link>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <h2 className="text-2xl text-stone-600 font-cormorant font-semibold underline uppercase my-5">
          Create A Post
        </h2>
        
        <fieldset className="fieldset bg-ivory text-stone-800 min-w-sm border-x border-x-khaki text-lg p-10 flex flex-col gap-2">
          
          <label className="label font-coptic">Post Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} // Correct way to handle files
            className="file-input bg-light border-khaki rounded-none p-2" 
          />
          <label className="label text-[10px] text-stone-500">Max size 2MB</label>

          <label className="label font-coptic">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input bg-light border-khaki rounded-none p-2"
            placeholder="What is your post about?"
            required
          />

          <label className="label font-coptic">Content</label>
          <textarea 
            className="textarea bg-light border-khaki rounded-none p-2 min-h-[100px]" 
            placeholder="Write your post..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <label className="label font-coptic">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input bg-light border-khaki rounded-none p-2"
            placeholder="What is your post about?"
            required
          />

          <button 
            type="submit" 
            className="mt-5 bg-stone-800 text-ivory py-2 font-coptic hover:bg-stone-700 transition-colors"
          >
            Publish Post
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default PostForm;