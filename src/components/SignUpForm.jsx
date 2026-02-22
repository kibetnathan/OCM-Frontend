import { useState } from "react";
import useAuthStore from "../zustand/authStore";

function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [DoB, setDoB] = useState("");
  const [campus, setCampus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school, setSchool] = useState("");
  const [workplace, setWorkplace] = useState("");

  const { register, loading, error, user } = useAuthStore();

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
    } catch (err) {
      console.error(err);
    }
  };

  if (user) return (
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
            <button className="btn bg-amber-600 border-0 rounded-none font-coptic tracking-wide text-stone-800 btn-lg">TO HOME</button>
          </div>
        </div>
      </div>
    );


  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset text-stone-700 bg-ivory border-khaki rounded-box w-xs border p-4">
        
        <h3 className="text-3xl font-cormorant text-center text-amber-600">Sign Up</h3>
        <label className="label">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">First Name</label>
        <input value={first_name} onChange={(e) => setFirstName(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Last Name</label>
        <input value={last_name} onChange={(e) => setLastName(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Date of Birth</label>
        <input type="date" value={DoB} onChange={(e) => setDoB(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Campus</label>
        <input value={campus} onChange={(e) => setCampus(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Phone Number</label>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">School</label>
        <input value={school} onChange={(e) => setSchool(e.target.value)} className="input bg-light text-black border border-khaki" />

        <label className="label">Workplace</label>
        <input value={workplace} onChange={(e) => setWorkplace(e.target.value)} className="input bg-light text-black border border-khaki" />

        <button type="submit" disabled={loading} className="btn btn-neutral mt-4">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </fieldset>
    </form>
  );
}

export default SignUpForm;