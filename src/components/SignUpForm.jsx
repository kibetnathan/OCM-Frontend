import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [DoB, setDoB] = useState("");
  const [campus, setCampus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school, setSchool] = useState("");
  const [workplace, setWorkplace] = useState("");

  const { register, loading, error, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra fields as per api view requirements
    const extraFields = {
      DoB,
      campus,
      phone_number: phoneNumber,
      school,
      workplace,
      password2: password, // Django RegistrationForm requires second password field for confirmation
    };

    try {
      await register(username, email, password, extraFields); // pass extraFields
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (user) return <div>Welcome, {user.username}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Sign Up</legend>

        <label className="label">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" />

        <label className="label">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />

        <label className="label">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

        <label className="label">Date of Birth</label>
        <input type="date" value={DoB} onChange={(e) => setDoB(e.target.value)} className="input" />

        <label className="label">Campus</label>
        <input value={campus} onChange={(e) => setCampus(e.target.value)} className="input" />

        <label className="label">Phone Number</label>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input" />

        <label className="label">School</label>
        <input value={school} onChange={(e) => setSchool(e.target.value)} className="input" />

        <label className="label">Workplace</label>
        <input value={workplace} onChange={(e) => setWorkplace(e.target.value)} className="input" />

        <button type="submit" disabled={loading} className="btn btn-neutral mt-4">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </fieldset>
    </form>
  );
}

export default SignUpForm;