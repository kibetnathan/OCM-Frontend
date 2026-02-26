import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconBook = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const IconPlus = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const IconSearch = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const IconX = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const IconCalendar = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

const IconClock = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="font-cormorant text-2xl font-semibold text-stone-800 shrink-0">
        {children}
      </h2>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

function InputLabel({ children }) {
  return (
    <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
      {children}
    </label>
  );
}

// Parse ISO 8601 duration (e.g. "P14D", "P2W") into a readable string
function parseDuration(iso) {
  if (!iso) return "—";
  const weeks = iso.match(/(\d+)W/);
  const days = iso.match(/(\d+)D/);
  if (weeks) return `${weeks[1]} week${weeks[1] !== "1" ? "s" : ""}`;
  if (days) {
    const w = Math.floor(Number(days[1]) / 7);
    const d = Number(days[1]) % 7;
    if (w && d) return `${w}w ${d}d`;
    if (w) return `${w} week${w !== 1 ? "s" : ""}`;
    return `${d} day${d !== 1 ? "s" : ""}`;
  }
  return iso;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Determine if a course is active, upcoming, or completed based on start date + duration
function courseStatus(course) {
  if (!course.start_date) return null;
  const start = new Date(course.start_date);
  const now = new Date();

  let endDate = null;
  if (course.expected_duration) {
    const days = course.expected_duration.match(/(\d+)D/);
    const weeks = course.expected_duration.match(/(\d+)W/);
    const totalDays = weeks ? Number(weeks[1]) * 7 : days ? Number(days[1]) : 0;
    if (totalDays) endDate = new Date(start.getTime() + totalDays * 86400000);
  }

  if (now < start)
    return {
      label: "Upcoming",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    };
  if (endDate && now > endDate)
    return {
      label: "Completed",
      color: "text-stone-500 bg-stone-50 border-stone-200",
    };
  return {
    label: "Active",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };
}

// ── Course Card ───────────────────────────────────────────────────────────────

function CourseCard({ course, allUsers, allProfiles, onSelect, isSelected }) {
  const memberList = allUsers.filter((u) => course.members?.includes(u.id));
  const leader = allUsers.find((u) => u.id === course.leader);
  const leaderProfile = allProfiles.find((p) => p.user?.id === course.leader);
  const status = courseStatus(course);

  return (
    <div
      onClick={() => onSelect(course)}
      className={`flex flex-col bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${
        isSelected ? "border-amber-400 shadow-md" : "border-stone-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-stone-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight truncate">
            {course.name}
          </h3>
          {course.description && (
            <p className="text-xs text-stone-400 mt-1 line-clamp-2">
              {course.description}
            </p>
          )}
        </div>
        {status && (
          <span
            className={`text-[0.6rem] uppercase tracking-widest border px-2 py-1 shrink-0 ml-3 ${status.color}`}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="px-5 py-3 flex items-center gap-4 border-b border-stone-100 flex-wrap">
        <div className="flex items-center gap-1.5 text-stone-400">
          <IconCalendar />
          <span className="text-xs">{formatDate(course.start_date)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-400">
          <IconClock />
          <span className="text-xs">
            {parseDuration(course.expected_duration)}
          </span>
        </div>
      </div>

      {/* Leader + members */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={leaderProfile?.profile_pic || "/images/defaultavatar.jpg"}
            alt={leader?.username || "Instructor"}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/30"
          />
          <div>
            <p className="text-[0.55rem] uppercase tracking-widest text-stone-400 font-coptic leading-none">
              Instructor
            </p>
            <p className="text-xs text-stone-600">
              {leader
                ? leader.first_name && leader.last_name
                  ? `${leader.first_name} ${leader.last_name}`
                  : leader.username
                : "—"}
            </p>
          </div>
        </div>

        {/* Member avatars */}
        <div className="flex items-center">
          {memberList.slice(0, 4).map((m) => {
            const mp = allProfiles.find((p) => p.user?.id === m.id);
            return (
              <img
                key={m.id}
                src={mp?.profile_pic || "/images/defaultavatar.jpg"}
                alt={m.username}
                title={
                  m.first_name ? `${m.first_name} ${m.last_name}` : m.username
                }
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white -ml-1.5 first:ml-0"
              />
            );
          })}
          {memberList.length > 4 && (
            <span className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.5rem] text-stone-500 -ml-1.5">
              +{memberList.length - 4}
            </span>
          )}
          {memberList.length === 0 && (
            <p className="text-[0.6rem] text-stone-300 italic">No enrolments</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function CourseDetail({ course, allUsers, allProfiles, onClose }) {
  const memberList = allUsers.filter((u) => course.members?.includes(u.id));
  const leader = allUsers.find((u) => u.id === course.leader);
  const leaderProfile = allProfiles.find((p) => p.user?.id === course.leader);
  const status = courseStatus(course);

  return (
    <div className="relative overflow-hidden bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-1">
            Course
          </p>
          <h3 className="font-cormorant text-2xl font-semibold text-stone-100 leading-tight">
            {course.name}
          </h3>
          {status && (
            <span
              className={`inline-block mt-1 text-[0.6rem] uppercase tracking-widest border px-2 py-0.5 ${status.color}`}
            >
              {status.label}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-stone-600 hover:text-stone-300 transition-colors p-1"
        >
          <IconX />
        </button>
      </div>

      {course.description && (
        <p className="text-xs text-stone-400 leading-relaxed relative z-10 border-l-2 border-amber-500/30 pl-3">
          {course.description}
        </p>
      )}

      {/* Dates */}
      <div className="relative z-10 grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 px-3 py-2.5">
          <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500 mb-1">
            Start Date
          </p>
          <p className="text-sm text-stone-200">
            {formatDate(course.start_date)}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-2.5">
          <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500 mb-1">
            Duration
          </p>
          <p className="text-sm text-stone-200">
            {parseDuration(course.expected_duration)}
          </p>
        </div>
      </div>

      {/* Instructor */}
      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">
          Instructor
        </p>
        <div className="flex items-center gap-3">
          <img
            src={leaderProfile?.profile_pic || "/images/defaultavatar.jpg"}
            alt={leader?.username || "Instructor"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30"
          />
          <div>
            <p className="text-sm font-cormorant font-semibold text-stone-200">
              {leader
                ? leader.first_name && leader.last_name
                  ? `${leader.first_name} ${leader.last_name}`
                  : leader.username
                : "No instructor assigned"}
            </p>
            {leader && (
              <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500">
                @{leader.username}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enrolled */}
      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">
          Enrolled ({memberList.length})
        </p>
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {memberList.length > 0 ? (
            memberList.map((m) => {
              const mp = allProfiles.find((p) => p.user?.id === m.id);
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <img
                    src={mp?.profile_pic || "/images/defaultavatar.jpg"}
                    alt={m.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-stone-300 truncate">
                      {m.first_name && m.last_name
                        ? `${m.first_name} ${m.last_name}`
                        : m.username}
                    </p>
                    <p className="font-coptic text-[0.55rem] text-stone-600 truncate">
                      @{m.username}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-stone-600 italic">No enrolments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create Form ───────────────────────────────────────────────────────────────

function CreateCourseForm({ allUsers, allProfiles, onSuccess }) {
  const createCourse = useMainStore((state) => state.createCourse);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("weeks");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const filteredUsers = allUsers.filter((u) => {
    const q = memberSearch.toLowerCase();
    const name = `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase();
    return q ? name.includes(q) : true;
  });

  const toggleMember = (id) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  // Convert duration number + unit to ISO 8601 duration string
  const buildDuration = () => {
    if (!duration) return null;
    const totalDays =
      durationUnit === "weeks" ? Number(duration) * 7 : Number(duration);
    return `${totalDays} 00:00:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Course name is required.");
    if (!startDate) return setError("Start date is required.");
    if (!duration) return setError("Duration is required.");
    setSubmitting(true);
    const result = await createCourse({
      name,
      description,
      leader: leaderId ? Number(leaderId) : null,
      start_date: startDate,
      expected_duration: buildDuration(),
      members: selectedMembers,
    });
    setSubmitting(false);
    if (result?.success) {
      setName("");
      setDescription("");
      setLeaderId("");
      setStartDate("");
      setDuration("");
      setSelectedMembers([]);
      setMemberSearch("");
      onSuccess?.();
    } else {
      setError("Failed to create course. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Course Name *</InputLabel>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Foundations of Faith"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>
          Description{" "}
          <span className="text-stone-300 normal-case tracking-normal">
            (optional)
          </span>
        </InputLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What will this course cover?"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full"
        />
      </div>

      {/* Start date + duration */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <InputLabel>Start Date *</InputLabel>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <InputLabel>Duration *</InputLabel>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 8"
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
              required
            />
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value)}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-2 py-2.5 text-sm text-stone-700 transition-colors shrink-0"
            >
              <option value="weeks">wks</option>
              <option value="days">days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instructor */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>
          Instructor{" "}
          <span className="text-stone-300 normal-case tracking-normal">
            (optional)
          </span>
        </InputLabel>
        <select
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full"
        >
          <option value="">Select an instructor…</option>
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name && u.last_name
                ? `${u.first_name} ${u.last_name} (@${u.username})`
                : `@${u.username}`}
            </option>
          ))}
        </select>
      </div>

      {/* Enrol members */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>
          Enrol Members{" "}
          <span className="text-stone-300 normal-case tracking-normal">
            (optional)
          </span>
        </InputLabel>

        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {selectedMembers.map((id) => {
              const u = allUsers.find((u) => u.id === id);
              return (
                <span
                  key={id}
                  className="flex items-center gap-1 text-[0.65rem] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1"
                >
                  {u?.first_name || u?.username}
                  <button
                    type="button"
                    onClick={() => toggleMember(id)}
                    className="hover:text-amber-900"
                  >
                    <IconX />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
            <IconSearch />
          </span>
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Search members…"
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
          />
        </div>

        <div className="border border-stone-200 divide-y divide-stone-100 max-h-44 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => {
              const mp = allProfiles.find((p) => p.user?.id === u.id);
              const checked = selectedMembers.includes(u.id);
              return (
                <div
                  key={u.id}
                  onClick={() => toggleMember(u.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${checked ? "bg-amber-50" : "hover:bg-stone-50"}`}
                >
                  <img
                    src={mp?.profile_pic || "/images/defaultavatar.jpg"}
                    alt={u.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-700 truncate">
                      {u.first_name && u.last_name
                        ? `${u.first_name} ${u.last_name}`
                        : u.username}
                    </p>
                    <p className="font-coptic text-[0.55rem] text-stone-400 truncate">
                      @{u.username}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-stone-300 px-3 py-4 text-center italic">
              No users found
            </p>
          )}
        </div>

        {selectedMembers.length > 0 && (
          <p className="text-[0.6rem] text-stone-400 uppercase tracking-widest">
            {selectedMembers.length} member
            {selectedMembers.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      {error && (
        <p className="text-[0.6rem] uppercase tracking-widest text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="animate-pulse">Creating…</span>
        ) : (
          <>
            <IconPlus />
            <span>Create Course</span>
          </>
        )}
      </button>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function CourseDashboard() {
  const token = useAuthStore((state) => state.token);

  const courses = useMainStore((state) => state.courses);
  const allUsers = useMainStore((state) => state.users) || [];
  const allProfiles = useMainStore((state) => state.profiles) || [];

  const fetchCourses = useMainStore((state) => state.fetchCourses);
  const fetchUsers = useMainStore((state) => state.fetchUsers);
  const fetchProfiles = useMainStore((state) => state.fetchProfiles);

  const courseList =
    courses?.results ?? (Array.isArray(courses) ? courses : []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchCourses();
    fetchUsers();
    fetchProfiles();
  }, [token, fetchCourses, fetchUsers, fetchProfiles]);

  const filtered = courseList.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter === "all") return true;
    const s = courseStatus(c);
    return s?.label.toLowerCase() === statusFilter;
  });

  const activeCount = courseList.filter(
    (c) => courseStatus(c)?.label === "Active",
  ).length;
  const upcomingCount = courseList.filter(
    (c) => courseStatus(c)?.label === "Upcoming",
  ).length;
  const completedCount = courseList.filter(
    (c) => courseStatus(c)?.label === "Completed",
  ).length;
  const totalEnrolled = courseList.reduce(
    (acc, c) => acc + (c.members?.length ?? 0),
    0,
  );

  const handleSuccess = () => {
    setShowForm(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">
      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">
            Groups
          </p>
          <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">
            Courses
          </h1>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setSelected(null);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors"
        >
          <IconPlus />
          {showForm ? "Cancel" : "New Course"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          Course created successfully ✓
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ── Left: list ── */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Stats bar */}
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200 flex-wrap">
            {[
              { label: "Total", value: courses?.count ?? courseList.length },
              { label: "Active", value: activeCount },
              { label: "Upcoming", value: upcomingCount },
              { label: "Completed", value: completedCount },
              { label: "Total Enrolled", value: totalEnrolled },
            ].map(({ label, value }, i, arr) => (
              <React.Fragment key={label}>
                <div>
                  <p className="font-cormorant text-3xl font-light text-stone-800">
                    {value}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">
                    {label}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px h-8 bg-stone-200" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Search + filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
                <IconSearch />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses…"
                className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors shrink-0"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  allUsers={allUsers}
                  allProfiles={allProfiles}
                  onSelect={(c) => {
                    setSelected(c);
                    setShowForm(false);
                  }}
                  isSelected={selected?.id === course.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-px bg-amber-500/40" />
              <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                {search || statusFilter !== "all"
                  ? "No courses match your filters"
                  : "No courses yet"}
              </p>
              <div className="w-8 h-px bg-amber-500/40" />
            </div>
          )}
        </div>

        {/* ── Right: detail or form ── */}
        <div className="xl:col-span-1">
          {showForm ? (
            <>
              <SectionHeading>New Course</SectionHeading>
              <CreateCourseForm
                allUsers={allUsers}
                allProfiles={allProfiles}
                onSuccess={handleSuccess}
              />
            </>
          ) : selected ? (
            <>
              <SectionHeading>Course Details</SectionHeading>
              <CourseDetail
                course={selected}
                allUsers={allUsers}
                allProfiles={allProfiles}
                onClose={() => setSelected(null)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              <IconBook />
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                Select a course to view details
                <br />
                or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDashboard;
