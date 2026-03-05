import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// Username check status: null | "too_short" | "checking" | "available" | "taken" | "error"
function useUsernameCheck(username) {
  const [status, setStatus] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (!username) { setStatus(null); return; }
    if (username.length < 3) { setStatus("too_short"); return; }

    setStatus("checking");
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API}/check-username/?username=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        setStatus(data.available ? "available" : "taken");
      } catch {
        setStatus("error");
      }
    }, 600);

    return () => clearTimeout(timerRef.current);
  }, [username]);

  return status;
}

const USERNAME_HINT = {
  too_short: ["text-stone-400", "At least 3 characters required"],
  checking:  ["text-stone-400", "Checking…"],
  available: ["text-green-600", "✓ Username available"],
  taken:     ["text-red-400",   "✗ Username already taken"],
  error:     ["text-red-400",   "Could not check username"],
};

function SignUpForm() {
  const navigate = useNavigate();
  const { register, loading, error, user } = useAuthStore();

  const [username,    setUsername]    = useState("");
  const [email,       setEmail]       = useState("");
  const [first_name,  setFirstName]   = useState("");
  const [last_name,   setLastName]    = useState("");
  const [password,    setPassword]    = useState("");
  const [DoB,         setDoB]         = useState("");
  const [campus,      setCampus]      = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school,      setSchool]      = useState("");
  const [workplace,   setWorkplace]   = useState("");

  const usernameStatus = useUsernameCheck(username);
  const canSubmit = !loading && usernameStatus === "available";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(email, password, {
      username,
      first_name,
      last_name,
      DoB,
      campus,
      phone_number: phoneNumber,
      school,
      workplace,
    });
    if (success) navigate("/feed/");
  };

  // Already logged-in guard (e.g. if initAuth hydrates a session)
  if (user) return (
    <div className="min-h-screen w-full bg-[#faf8f3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-8 h-0.5 bg-amber-500" />
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic">Account created</p>
        <h2 className="font-cormorant text-4xl font-semibold text-stone-800">{user?.username}</h2>
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

      {/* ── Left panel ── */}
      <div className="hidden lg:block relative w-[40%] shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0f0f0d]/80 via-[#0f0f0d]/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full p-12">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-amber-400 font-coptic mb-3">
            Open Church Management
          </p>
          <h1 className="font-cormorant text-5xl font-semibold text-stone-100 leading-tight mb-4">
            Join the<br />
            <span className="italic text-amber-400">family</span>
          </h1>
          <div className="w-8 h-0.5 bg-amber-500" />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">

          <div className="mb-8">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic mb-2">New Member</p>
            <h2 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">Create Account</h2>
            <div className="w-6 h-0.5 bg-amber-500 mt-3" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Account */}
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic border-b border-stone-200 pb-2">
              Account
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <input type="text" value={first_name} onChange={e => setFirstName(e.target.value)}
                  placeholder="First" className={inputCls} />
              </Field>
              <Field label="Last Name">
                <input type="text" value={last_name} onChange={e => setLastName(e.target.value)}
                  placeholder="Last" className={inputCls} />
              </Field>
            </div>

            {/* Username with live availability hint */}
            <Field label="Username *">
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username" required
                className={`${inputCls} ${usernameStatus === "taken" ? "border-red-300" : usernameStatus === "available" ? "border-green-300" : ""}`}
              />
              {usernameStatus && USERNAME_HINT[usernameStatus] && (
                <p className={`text-[0.6rem] mt-1 font-coptic tracking-widest ${USERNAME_HINT[usernameStatus][0]}`}>
                  {USERNAME_HINT[usernameStatus][1]}
                </p>
              )}
            </Field>

            <Field label="Email *">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required className={inputCls} />
            </Field>

            <Field label="Password *">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Create a password" required className={inputCls} />
            </Field>

            {/* Personal */}
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic border-b border-stone-200 pb-2 mt-2">
              Personal
            </p>

            <Field label="Date of Birth">
              <input type="date" value={DoB} onChange={e => setDoB(e.target.value)} className={inputCls} />
            </Field>

            <Field label="Phone Number">
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+254 700 000 000" className={inputCls} />
            </Field>

            <Field label="Campus">
              <input type="text" value={campus} onChange={e => setCampus(e.target.value)}
                placeholder="e.g. Hill City" className={inputCls} />
            </Field>

            {/* Background */}
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 font-coptic border-b border-stone-200 pb-2 mt-2">
              Background
            </p>

            <Field label="School">
              <input type="text" value={school} onChange={e => setSchool(e.target.value)}
                placeholder="Your school or university" className={inputCls} />
            </Field>

            <Field label="Workplace">
              <input type="text" value={workplace} onChange={e => setWorkplace(e.target.value)}
                placeholder="Where do you work?" className={inputCls} />
            </Field>

            {error && (
              <p className="text-[0.6rem] uppercase tracking-widest text-red-400 font-coptic">{error}</p>
            )}

            {/* Submit — disabled until username is confirmed available */}
            <button
              type="submit"
              disabled={!canSubmit}
              title={usernameStatus !== "available" ? "Enter a valid, available username first" : ""}
              className="mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center"
            >
              {loading ? <span className="animate-pulse">Creating account…</span> : "Create Account"}
            </button>

          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <Link to="/auth/login"
              className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-colors shrink-0">
              Already have an account
            </Link>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

const inputCls =
  "bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">{label}</label>
      {children}
    </div>
  );
}

export default SignUpForm;