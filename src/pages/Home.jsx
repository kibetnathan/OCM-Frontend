import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <header
        className="relative min-h-screen w-full flex items-center"
        style={{ backgroundImage: "url(images/mavuno_entrance.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-20">
          <div className="max-w-2xl bg-black/30 backdrop-blur-sm shadow-[0px_0px_40px_rgba(0,0,0,0.6)] p-8 sm:p-12">
            <span className="text-xs text-amber-500 font-coptic tracking-[0.25em] uppercase">
              — Powered by Mavuno Church
            </span>
            <h1 className="mt-4 mb-6 text-4xl sm:text-5xl lg:text-[3.5rem] font-cormorant font-light text-white leading-tight">
              This is{" "}
              <span className="text-amber-500 italic font-bold">
                Open Church Management
              </span>
            </h1>
            <p className="mb-8 text-base sm:text-lg text-stone-300 font-coptic leading-relaxed">
              A free, open-source platform built for Mavuno Church — connecting
              members, leadership, and fellowship groups in one place.
            </p>
            <Link
              to={user ? "/feed" : "/auth/login"}
              className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-coptic text-xs uppercase tracking-[0.2em] px-8 py-4 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── About strip ── */}
      <section id="about" className="bg-[#faf8f3] border-b border-stone-200 px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
          <div className="lg:w-1/2">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-3">About the Platform</p>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light text-stone-800 leading-tight">
              Built for Mavuno.<br />
              <span className="text-amber-500 italic">Free for any church.</span>
            </h2>
            <div className="w-8 h-0.5 bg-amber-500 mt-5" />
          </div>
          <p className="lg:w-1/2 text-stone-500 font-coptic text-sm sm:text-base leading-relaxed pt-2">
            OCM was designed around how Mavuno Church actually operates — with fellowship groups,
            serving departments, discipleship courses, and a leadership structure that values
            both accountability and flexibility. It's open source so any Baptist or low-church
            congregation can adapt it to their own needs without paying for enterprise software.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#0f0f0d] px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "5+",    label: "Fellowship Groups" },
            { value: "3",     label: "Serving Departments" },
            { value: "100%",  label: "Open Source" },
            { value: "1",     label: "Church, Many Members" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <p className="font-cormorant text-4xl sm:text-5xl font-light text-amber-500">{value}</p>
              <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[#faf8f3] px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-2">What's Inside</p>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light text-stone-800">Platform Features</h2>
            <div className="w-8 h-0.5 bg-amber-500 mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Fellowship Groups",
                body: "Members are organised into fellowship groups — Young Adults, Women of Grace, Men's Brotherhood, and more. Leaders manage membership and group activities from the dashboard.",
              },
              {
                number: "02",
                title: "Serving Departments",
                body: "Track which members serve in worship, hospitality, media, or ushering. Assign crew to services and manage equipment from one place.",
              },
              {
                number: "03",
                title: "Discipleship Courses",
                body: "Run structured courses within the church — track enrolment, progress, and completion across different cohorts of members.",
              },
              {
                number: "04",
                title: "Role-Based Access",
                body: "Pastors, Jr Leaders, Elders, and Staff get full dashboard access. Regular members see the feed and their own groups — no more data leaks.",
              },
              {
                number: "05",
                title: "Community Feed",
                body: "A shared feed for posts, announcements, and updates. Members can like and comment; leadership can broadcast to the whole church.",
              },
              {
                number: "06",
                title: "Group Messaging",
                body: "Real-time group chats tied to each fellowship group — so Young Adults can coordinate Friday Bible study without leaving the platform.",
              },
            ].map(({ number, title, body }) => (
              <div key={number} className="bg-white border border-stone-100 p-6 hover:border-amber-300 hover:shadow-md transition-all group">
                <p className="font-cormorant text-3xl font-light text-amber-500/60 mb-4 group-hover:text-amber-500 transition-colors">
                  {number}
                </p>
                <h3 className="font-cormorant text-xl font-semibold text-stone-800 mb-2">{title}</h3>
                <p className="font-coptic text-xs text-stone-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-stone-100 px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-2">How It Works</p>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light text-stone-800">For Every Role</h2>
            <div className="w-8 h-0.5 bg-amber-500 mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: "Member",
                color: "border-stone-300",
                accent: "text-stone-600",
                points: [
                  "View and react to the community feed",
                  "See your fellowship group and courses",
                  "Chat in your group's messaging channel",
                  "Edit your profile and profile picture",
                ],
              },
              {
                role: "Leader / Elder",
                color: "border-amber-400",
                accent: "text-amber-600",
                points: [
                  "Everything a Member can do",
                  "Manage fellowship groups and members",
                  "Run and enrol members in courses",
                  "Assign serving roles and departments",
                ],
              },
              {
                role: "Pastor / Staff",
                color: "border-stone-800",
                accent: "text-stone-800",
                points: [
                  "Full dashboard access",
                  "Manage all users and leadership roles",
                  "Oversee services and equipment",
                  "View church-wide analytics and data",
                ],
              },
            ].map(({ role, color, accent, points }) => (
              <div key={role} className={`bg-white border-t-4 ${color} p-6 shadow-sm`}>
                <h3 className={`font-cormorant text-2xl font-semibold ${accent} mb-4`}>{role}</h3>
                <ul className="flex flex-col gap-2.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <span className="font-coptic text-xs text-stone-500 leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="bg-[#0f0f0d] px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="lg:w-1/3 shrink-0">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-2">Under the Hood</p>
            <h2 className="font-cormorant text-4xl font-light text-stone-100">Built on solid foundations</h2>
            <div className="w-8 h-0.5 bg-amber-500 mt-4" />
            <p className="font-coptic text-xs text-stone-500 leading-relaxed mt-5">
              Chosen for reliability, flexibility, and the ability to self-host
              without ongoing licensing costs.
            </p>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { layer: "Backend",       tech: "Django & Python",     note: "REST API via djangorestframework + JWT auth" },
                { layer: "Frontend",      tech: "React + Tailwind CSS", note: "Vite, Zustand for state, React Router" },
                { layer: "Database",      tech: "PostgreSQL",           note: "Relational data with psycopg2" },
                { layer: "Media",         tech: "Cloudinary",           note: "Profile pictures and post images" },
                { layer: "Real-time",     tech: "Firebase",             note: "Group messaging channels" },
                { layer: "Deployment",    tech: "Self-hostable",        note: "Open source — run it on your own server" },
              ].map(({ layer, tech, note }) => (
                <div key={layer} className="border border-white/6 p-4 hover:border-amber-500/30 transition-colors">
                  <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-600 mb-1">{layer}</p>
                  <p className="font-cormorant text-lg font-semibold text-stone-200">{tech}</p>
                  <p className="font-coptic text-[0.6rem] text-stone-600 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-amber-500 px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-black leading-tight">
              Ready to get started?
            </h2>
            <p className="font-coptic text-xs text-black/60 mt-2 tracking-wide">
              Join Mavuno Church's platform or fork it for your own congregation.
            </p>
          </div>
          <Link
            to={user ? "/feed" : "/auth/login"}
            className="shrink-0 bg-black hover:bg-stone-800 text-white font-coptic text-xs uppercase tracking-[0.2em] px-8 py-4 transition-colors"
          >
            {user ? "Go to Feed" : "Sign In"}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;