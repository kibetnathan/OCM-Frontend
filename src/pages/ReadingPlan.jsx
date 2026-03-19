import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useAuthStore from '../zustand/authStore';
import useReadingPlanStore from '../zustand/useReadingPlanStore';

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconExternal = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

const LEADER_GROUPS = ['Pastor', 'Leader', 'DG Leader', 'Department Leader', 'Course Leader'];

function isLeader(user) {
  if (!user) return false;
  if (user.is_staff) return true;
  const groups = user.groups?.map(g => (typeof g === 'string' ? g : g.name)) ?? [];
  return groups.some(g => LEADER_GROUPS.includes(g));
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── YouVersion Widget ──────────────────────────────────────────────────────────

function YouVersionWidget({ widgetUrl, title }) {
  if (!widgetUrl) return null;
  return (
    <div className="w-full overflow-hidden border border-stone-200 bg-white">
      <iframe
        src={widgetUrl}
        title={`YouVersion plan: ${title}`}
        className="w-full"
        style={{ height: '220px', border: 'none' }}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation"
      />
    </div>
  );
}

// ── Plan detail drawer/modal ───────────────────────────────────────────────────

function PlanDetail({ plan, onClose, onJoin, onLeave, canEdit, onEdit, onDelete }) {
  const [joining,    setJoining]    = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    await onJoin(plan.id);
    setJoining(false);
  };

  const handleLeave = async () => {
    setJoining(true);
    await onLeave(plan.id);
    setJoining(false);
  };

  const scopeLabels = [];
  if (plan.is_church_wide) scopeLabels.push('Church-wide');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#faf8f3] border border-stone-200 shadow-2xl flex flex-col max-h-[90vh] rounded-t-2xl sm:rounded-none overflow-hidden">

        {/* Drag handle — mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-stone-200 shrink-0">
          <div className="min-w-0">
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-400 mb-0.5">Reading Plan</p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-800 leading-snug">{plan.title}</h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {canEdit && (
              <>
                <button onClick={() => onEdit(plan)}
                  className="p-1.5 text-stone-400 hover:text-amber-600 border border-transparent hover:border-amber-200 transition-colors"
                >
                  <IconEdit />
                </button>
                {confirming ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => { onDelete(plan.id); onClose(); }}
                      className="font-coptic text-[0.5rem] uppercase tracking-widest text-red-500 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors"
                    >Delete</button>
                    <button onClick={() => setConfirming(false)}
                      className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400 border border-stone-200 px-2 py-1 transition-colors"
                    >Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirming(true)}
                    className="p-1.5 text-stone-400 hover:text-red-500 border border-transparent hover:border-red-200 transition-colors"
                  >
                    <IconTrash />
                  </button>
                )}
              </>
            )}
            <button onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 transition-colors"
            >
              <IconX />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Meta strip */}
          <div className="flex items-center gap-3 flex-wrap">
            {plan.is_church_wide && (
              <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-500 border border-stone-200 px-2 py-0.5">
                Church-wide
              </span>
            )}
            {plan.duration_days && (
              <span className="flex items-center gap-1 font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
                <IconCalendar /> {plan.duration_days} days
              </span>
            )}
            {plan.start_date && (
              <span className="flex items-center gap-1 font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
                Starts {formatDate(plan.start_date)}
              </span>
            )}
            <span className="flex items-center gap-1 font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
              <IconUsers /> {plan.member_count ?? 0} joined
            </span>
            {plan.created_by_name && (
              <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
                Added by {plan.created_by_name}
              </span>
            )}
          </div>

          {/* Description */}
          {plan.description && (
            <p className="font-serif text-sm text-stone-600 leading-relaxed">{plan.description}</p>
          )}

          {/* YouVersion widget embed */}
          <YouVersionWidget widgetUrl={plan.widget_url} title={plan.title} />

          {/* Open on YouVersion */}
          <a
            href={plan.youversion_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 py-2.5 transition-colors"
          >
            <IconExternal /> Open on YouVersion
          </a>

          {/* Join / Leave */}
          {plan.is_joined ? (
            <button
              onClick={handleLeave}
              disabled={joining}
              className="flex items-center justify-center gap-2 w-full font-coptic text-[0.6rem] uppercase tracking-widest text-green-700 border border-green-200 bg-green-50 hover:bg-white py-2.5 transition-colors disabled:opacity-50"
            >
              {joining
                ? <div className="w-4 h-4 border border-green-400/40 border-t-green-500 rounded-full animate-spin" />
                : <><IconCheck /> Following this plan</>
              }
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex items-center justify-center gap-2 w-full font-coptic text-[0.6rem] uppercase tracking-widest text-amber-700 border border-amber-300 bg-amber-50 hover:bg-amber-100 py-2.5 transition-colors disabled:opacity-50"
            >
              {joining
                ? <div className="w-4 h-4 border border-amber-400/40 border-t-amber-500 rounded-full animate-spin" />
                : 'Follow this plan'
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create / Edit modal ────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '', description: '', youversion_url: '',
  start_date: '', duration_days: '', is_active: true,
};

function PlanForm({ initial, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())         e.title = 'Required';
    if (!form.youversion_url.trim()) e.youversion_url = 'Required';
    if (!/reading-plans\/\d+/.test(form.youversion_url))
      e.youversion_url = 'Must be a YouVersion plan URL containing a plan ID';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      title:          form.title.trim(),
      description:    form.description.trim(),
      youversion_url: form.youversion_url.trim(),
      is_active:      form.is_active,
      ...(form.start_date    && { start_date:    form.start_date }),
      ...(form.duration_days && { duration_days: parseInt(form.duration_days, 10) }),
    };
    onSubmit(payload);
  };

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block font-coptic text-[0.5rem] uppercase tracking-widest text-stone-500 mb-1">{label}</label>
      {children}
      {error && <p className="font-coptic text-[0.45rem] uppercase tracking-widest text-red-500 mt-0.5">{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full border ${err ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-amber-400'} focus:outline-none px-3 py-2 text-sm text-stone-700 font-serif bg-white`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-[#faf8f3] border border-stone-200 shadow-2xl flex flex-col max-h-[90vh] rounded-t-2xl sm:rounded-none overflow-hidden">

        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone-200 shrink-0">
          <div>
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-400 mb-0.5">Reading Plans</p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-800">
              {initial ? 'Edit plan' : 'Add a plan'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 border border-stone-200 transition-colors">
            <IconX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <Field label="Title *" error={errors.title}>
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
              className={inputCls(errors.title)} placeholder="e.g. Through the Bible in a Year" />
          </Field>

          <Field label="YouVersion URL *" error={errors.youversion_url}>
            <input type="url" value={form.youversion_url} onChange={e => set('youversion_url', e.target.value)}
              className={inputCls(errors.youversion_url)}
              placeholder="https://www.bible.com/reading-plans/1234" />
            <p className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400 mt-1">
              Copy the URL from the plan page on Bible.com
            </p>
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} className={`${inputCls(false)} resize-none`}
              placeholder="Briefly describe this plan for your congregation…" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)}
                className={inputCls(false)} />
            </Field>
            <Field label="Duration (days)">
              <input type="number" min="1" value={form.duration_days} onChange={e => set('duration_days', e.target.value)}
                className={inputCls(false)} placeholder="e.g. 365" />
            </Field>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={form.is_active}
              onChange={e => set('is_active', e.target.checked)}
              className="accent-amber-500" />
            <label htmlFor="is_active" className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-500 cursor-pointer">
              Active (visible to congregation)
            </label>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-stone-200 shrink-0 flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400 border border-stone-200 hover:border-stone-400 px-4 py-2 transition-colors"
          >Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="font-coptic text-[0.55rem] uppercase tracking-widest text-amber-700 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-5 py-2 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-3.5 h-3.5 border border-amber-400/40 border-t-amber-500 rounded-full animate-spin" />}
            {initial ? 'Save changes' : 'Add plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Plan card ──────────────────────────────────────────────────────────────────

function PlanCard({ plan, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all group flex flex-col"
    >
      {/* Cover / widget preview strip */}
      <div className="h-1.5 w-full bg-stone-100 group-hover:bg-amber-100 transition-colors" />

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Scope badge */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {plan.is_church_wide ? (
            <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400 border border-stone-100 px-1.5 py-0.5">
              Church-wide
            </span>
          ) : (
            <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-amber-600 border border-amber-100 bg-amber-50 px-1.5 py-0.5">
              Your group
            </span>
          )}
          {plan.is_joined && (
            <span className="flex items-center gap-0.5 font-coptic text-[0.45rem] uppercase tracking-widest text-green-600 border border-green-100 bg-green-50 px-1.5 py-0.5">
              <IconCheck /> Following
            </span>
          )}
        </div>

        <div>
          <h3 className="font-cormorant text-lg font-semibold text-stone-800 leading-snug group-hover:text-amber-700 transition-colors">
            {plan.title}
          </h3>
          {plan.description && (
            <p className="font-serif text-xs text-stone-400 mt-1 line-clamp-2">{plan.description}</p>
          )}
        </div>

        {/* Footer meta */}
        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-stone-50">
          {plan.duration_days && (
            <span className="flex items-center gap-1 font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400">
              <IconCalendar /> {plan.duration_days}d
            </span>
          )}
          {plan.start_date && (
            <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400">
              {formatDate(plan.start_date)}
            </span>
          )}
          <span className="flex items-center gap-1 font-coptic text-[0.45rem] uppercase tracking-widest text-stone-400 ml-auto">
            <IconUsers /> {plan.member_count ?? 0}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function ReadingPlansPage() {
  const navigate = useNavigate();

  const plans      = useReadingPlanStore(s => s.plans);
  const myPlans    = useReadingPlanStore(s => s.myPlans);
  const loading    = useReadingPlanStore(s => s.loading);
  const fetchAll   = useReadingPlanStore(s => s.fetchAll);
  const joinPlan   = useReadingPlanStore(s => s.joinPlan);
  const leavePlan  = useReadingPlanStore(s => s.leavePlan);
  const createPlan = useReadingPlanStore(s => s.createPlan);
  const updatePlan = useReadingPlanStore(s => s.updatePlan);
  const deletePlan = useReadingPlanStore(s => s.deletePlan);

  const user = useAuthStore(s => s.user);
  const userIsLeader = isLeader(user);

  const [tab,          setTab]          = useState('all');   // 'all' | 'mine'
  const [selected,     setSelected]     = useState(null);    // plan being viewed
  const [showForm,     setShowForm]     = useState(false);
  const [editingPlan,  setEditingPlan]  = useState(null);
  const [saving,       setSaving]       = useState(false);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = useCallback(async (payload) => {
    setSaving(true);
    const result = await createPlan(payload);
    setSaving(false);
    if (result.success) setShowForm(false);
  }, [createPlan]);

  const handleUpdate = useCallback(async (payload) => {
    setSaving(true);
    const result = await updatePlan(editingPlan.id, payload);
    setSaving(false);
    if (result.success) {
      setEditingPlan(null);
      // Refresh selected if it was the one being edited
      if (selected?.id === editingPlan.id) setSelected(result.plan);
    }
  }, [updatePlan, editingPlan, selected]);

  const handleDelete = useCallback(async (id) => {
    await deletePlan(id);
    setSelected(null);
  }, [deletePlan]);

  const displayedPlans = tab === 'mine' ? myPlans : plans;

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <div className="flex flex-1 min-w-0 overflow-hidden flex-col">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border-b border-stone-200 bg-white shrink-0">
          <div className="flex-1 min-w-0">
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.25em] text-stone-400 mb-0.5">Mavuno</p>
            <h1 className="font-cormorant text-xl font-semibold text-stone-800 leading-none">Reading Plans</h1>
          </div>

          {userIsLeader && (
            <button
              onClick={() => { setEditingPlan(null); setShowForm(true); }}
              className="flex items-center gap-1.5 font-coptic text-[0.55rem] uppercase tracking-widest text-amber-700 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-2 transition-colors shrink-0"
            >
              <IconPlus /> Add plan
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-white shrink-0">
          {[
            { key: 'all',  label: `All plans${plans.length ? ` (${plans.length})` : ''}` },
            { key: 'mine', label: `Following${myPlans.length ? ` (${myPlans.length})` : ''}` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3 font-coptic text-[0.55rem] uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                tab === key
                  ? 'text-amber-600 border-amber-500'
                  : 'text-stone-400 border-transparent hover:text-stone-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-full gap-3">
              <div className="w-5 h-5 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
              <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">Loading…</p>
            </div>
          ) : displayedPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
              <p className="font-cormorant text-2xl text-stone-400">
                {tab === 'mine' ? 'No plans followed yet' : 'No reading plans yet'}
              </p>
              <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400">
                {tab === 'mine'
                  ? 'Browse all plans and tap Follow to track one here'
                  : userIsLeader
                    ? 'Add a YouVersion plan to get started'
                    : 'Check back soon'
                }
              </p>
              {tab === 'mine' && (
                <button onClick={() => setTab('all')}
                  className="mt-2 font-coptic text-[0.6rem] uppercase tracking-widest text-amber-600 border border-amber-200 hover:bg-amber-50 px-4 py-2 transition-colors"
                >Browse all plans →</button>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} onClick={() => setSelected(plan)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <PlanDetail
          plan={selected}
          onClose={() => setSelected(null)}
          onJoin={joinPlan}
          onLeave={leavePlan}
          canEdit={userIsLeader}
          onEdit={(plan) => { setEditingPlan(plan); setShowForm(true); setSelected(null); }}
          onDelete={handleDelete}
        />
      )}

      {/* Create / edit form */}
      {showForm && (
        <PlanForm
          initial={editingPlan}
          onSubmit={editingPlan ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditingPlan(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}

export default ReadingPlansPage;