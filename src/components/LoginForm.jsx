import { useState } from "react";
import useAuthStore from "../zustand/authStore";
import { Link } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, user } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  if (user) return (
    <div className="min-h-screen w-full bg-[#faf8f3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-8 h-0.5 bg-amber-500" />
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic">Welcome back</p>
        <h2 className="font-cormorant text-4xl font-semibold text-stone-800">
          {user?.username}
        </h2>
        <div className="w-8 h-0.5 bg-amber-500" />
        <Link
          to="/feed/"
          className="mt-2 font-coptic text-[0.65rem] uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 transition-colors"
        >
          Enter
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] flex items-stretch">

      {/* ── Left panel — stock image with overlay ── */}
      <div className="hidden lg:block relative w-[45%] shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1200&q=80"
          alt="Congregation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0f0f0d]/80 via-[#0f0f0d]/40 to-transparent" />
        {/* Content on image */}
        <div className="relative z-10 flex flex-col justify-end h-full p-12">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-amber-400 font-coptic mb-3">
            Open Church Management
          </p>
          <h1 className="font-cormorant text-5xl font-semibold text-stone-100 leading-tight mb-4">
            Serving the<br />
            <span className="italic text-amber-400">community</span><br />
            together
          </h1>
          <div className="w-8 h-0.5 bg-amber-500" />
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic mb-2">
              Member Portal
            </p>
            <h2 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">
              Welcome Back
            </h2>
            <div className="w-6 h-0.5 bg-amber-500 mt-3" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 transition-colors"
              />
            </div>

            {error && (
              <p className="text-[0.6rem] uppercase tracking-widest text-red-400 font-coptic">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-pulse">Signing in…</span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <Link
              to="/auth/signup"
              className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-colors shrink-0"
            >
              Create an account
            </Link>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default LoginForm;