// components/LoginForm.jsx
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

  if (user)
    return (
      <div className="card bg-ivory outline-khaki text-stone-600 outline w-96 shadow-sm">
        <figure className="px-10 pt-10">
          <img
            src="/images/crowd.jpg"
            alt="crowd"
            className="object-cover h-48 w-full"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title font-coptic text-2xl">Welcome back {user?.username} !</h2>
          <div className="card-actions">
            <Link to={"/feed/"} className="btn bg-amber-600 border-0 rounded-none font-coptic tracking-wide text-stone-800 btn-lg">TO HOME</Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-ivory border-khaki border-x flex flex-row w-[80%] pr-15 h-[60vh] items-center">
        <img src="/images/crowd.jpg" className="h-[60vh] w-[60vh] content-center object-cover" alt="Login" />
      <form className="flex flex-col justify-center items-center text-center w-full" onSubmit={handleSubmit}>
          <h3 className="fieldset-legend text-4xl text-stone-700 font-cormorant font-light mb-5">Welcome Back</h3>
          <h4 className="text-xl font-coptic text-stone-500">Login to your account</h4>
        <fieldset className="fieldset rounded-box w-xs text-black p-4 flex flex-col justify-center items-center text-center">

          <label className="label">Username</label>
          <input
            type="text"
            className="input bg-light outline-khaki outline"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input bg-light outline-khaki outline"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-neutral mt-4">Login</button>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : " "}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
      </form>
    </div>
  );
}

export default LoginForm;
