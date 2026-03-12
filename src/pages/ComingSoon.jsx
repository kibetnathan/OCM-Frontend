import React from 'react';
import Navbar from '../components/Navbar';

function ComingSoon() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col w-full min-h-screen justify-center items-center bg-amber-50"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 18px,
            rgba(180,120,40,0.07) 18px,
            rgba(180,120,40,0.07) 19px
          )`,
        }}
      >
        <div className="relative bg-[#0f0f0d]/90 border border-amber-700/40 rounded-sm w-full max-w-xl shadow-2xl overflow-hidden">

          {/* Top warning stripe */}
          <div
            className="w-full h-3"
            style={{
              background: 'repeating-linear-gradient(90deg, #b45309 0px, #b45309 20px, #1c1a14 20px, #1c1a14 40px)',
            }}
          />

          <div className="px-10 pt-8 pb-10">

            {/* Header row */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-amber-600" />
              <span className="font-coptic text-[10px] tracking-[0.35em] uppercase text-amber-600">
                Under Construction
              </span>
              <div className="flex-1 h-px bg-amber-700/30" />
            </div>

            {/* SVG Illustration — men at work */}
            <div className="flex justify-center mb-6">
              <svg
                width="320"
                height="160"
                viewBox="0 0 320 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Ground line */}
                <line x1="20" y1="140" x2="300" y2="140" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

                {/* --- Scaffold structure --- */}
                {/* Vertical poles */}
                <rect x="58" y="30" width="3" height="110" fill="#d97706" opacity="0.6" />
                <rect x="138" y="20" width="3" height="120" fill="#d97706" opacity="0.6" />
                <rect x="218" y="30" width="3" height="110" fill="#d97706" opacity="0.6" />
                {/* Horizontal beams */}
                <rect x="58" y="30" width="163" height="3" fill="#d97706" opacity="0.6" />
                <rect x="58" y="68" width="163" height="2" fill="#d97706" opacity="0.4" />
                <rect x="58" y="100" width="163" height="2" fill="#d97706" opacity="0.4" />
                {/* Plank on scaffold */}
                <rect x="55" y="98" width="168" height="6" fill="#92400e" opacity="0.5" rx="1" />

                {/* --- Worker 1 (digging, left) --- */}
                {/* Body */}
                <rect x="38" y="100" width="14" height="24" rx="2" fill="#78350f" />
                {/* Head */}
                <circle cx="45" cy="95" r="8" fill="#d97706" />
                {/* Hard hat */}
                <rect x="37" y="87" width="16" height="5" rx="2" fill="#b45309" />
                <rect x="35" y="90" width="20" height="2" rx="1" fill="#92400e" />
                {/* Arms */}
                <rect x="27" y="103" width="12" height="3" rx="1.5" fill="#78350f" />
                <rect x="52" y="103" width="10" height="3" rx="1.5" fill="#78350f" />
                {/* Shovel */}
                <rect x="20" y="100" width="2" height="30" rx="1" fill="#a16207" />
                <ellipse cx="21" cy="130" rx="6" ry="4" fill="#78350f" opacity="0.8" />
                {/* Legs */}
                <rect x="38" y="122" width="6" height="18" rx="2" fill="#451a03" />
                <rect x="46" y="122" width="6" height="18" rx="2" fill="#451a03" />
                {/* Dirt pile */}
                <ellipse cx="25" cy="140" rx="15" ry="5" fill="#92400e" opacity="0.35" />

                {/* --- Worker 2 (on scaffold, painting/working) --- */}
                {/* Body */}
                <rect x="125" y="74" width="14" height="22" rx="2" fill="#78350f" />
                {/* Head */}
                <circle cx="132" cy="69" r="8" fill="#d97706" />
                {/* Hard hat */}
                <rect x="124" y="61" width="16" height="5" rx="2" fill="#f59e0b" />
                <rect x="122" y="64" width="20" height="2" rx="1" fill="#d97706" />
                {/* Arm extended with tool */}
                <rect x="139" y="76" width="18" height="3" rx="1.5" fill="#78350f" />
                {/* Tool (wrench outline) */}
                <circle cx="162" cy="77" r="5" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <rect x="160" y="72" width="4" height="10" rx="1" fill="#f59e0b" opacity="0.6" />
                {/* Left arm */}
                <rect x="115" y="77" width="11" height="3" rx="1.5" fill="#78350f" />
                {/* Legs (sitting on plank) */}
                <rect x="125" y="96" width="6" height="8" rx="2" fill="#451a03" />
                <rect x="133" y="96" width="6" height="8" rx="2" fill="#451a03" />

                {/* --- Worker 3 (right, reading plans) --- */}
                {/* Body */}
                <rect x="240" y="100" width="14" height="24" rx="2" fill="#78350f" />
                {/* Head */}
                <circle cx="247" cy="95" r="8" fill="#d97706" />
                {/* Hard hat */}
                <rect x="239" y="87" width="16" height="5" rx="2" fill="#b45309" />
                <rect x="237" y="90" width="20" height="2" rx="1" fill="#92400e" />
                {/* Arms holding document */}
                <rect x="229" y="106" width="12" height="3" rx="1.5" fill="#78350f" />
                <rect x="254" y="106" width="10" height="3" rx="1.5" fill="#78350f" />
                {/* Blueprint/document */}
                <rect x="228" y="108" width="28" height="18" rx="2" fill="#1e3a5f" opacity="0.8" />
                <line x1="232" y1="112" x2="252" y2="112" stroke="#60a5fa" strokeWidth="0.8" opacity="0.7" />
                <line x1="232" y1="116" x2="248" y2="116" stroke="#60a5fa" strokeWidth="0.8" opacity="0.7" />
                <line x1="232" y1="120" x2="252" y2="120" stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" />
                {/* Legs */}
                <rect x="240" y="122" width="6" height="18" rx="2" fill="#451a03" />
                <rect x="248" y="122" width="6" height="18" rx="2" fill="#451a03" />

                {/* Gear icon floating */}
                <circle cx="290" cy="50" r="10" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.5" />
                <circle cx="290" cy="50" r="5" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.5" />
                {[0,45,90,135,180,225,270,315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 290 + Math.cos(rad) * 10;
                  const y1 = 50 + Math.sin(rad) * 10;
                  const x2 = 290 + Math.cos(rad) * 13;
                  const y2 = 50 + Math.sin(rad) * 13;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />;
                })}

                {/* Caution sign */}
                <polygon points="30,25 42,5 54,25" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                <text x="42" y="21" textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold" opacity="0.7">!</text>
              </svg>
            </div>

            {/* Title */}
            <h1 className="font-cormorant text-6xl font-light text-amber-500 leading-none text-center mb-1">
              Coming Soon
            </h1>

            {/* Subtitle */}
            <p className="font-cormorant text-xs tracking-widest uppercase text-stone-500 text-center mb-5">
              Work In Progress
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-amber-700/25" />
              <div className="w-1.5 h-1.5 bg-amber-600 rotate-45" />
              <div className="flex-1 h-px bg-amber-700/25" />
            </div>

            {/* Body copy */}
            <p className="font-coptic text-stone-400 leading-relaxed text-center text-sm mb-8">
              Our team is still building this feature. Check back soon — great things take time.
            </p>

            {/* CTA */}
            <div className="flex justify-center">
              <a
                href="/feed"
                className="inline-block font-coptic text-xs tracking-[0.4em] uppercase bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold px-8 py-3 transition-colors duration-200"
              >
                Return To Feed
              </a>
            </div>
          </div>

          {/* Bottom warning stripe */}
          <div
            className="w-full h-3"
            style={{
              background: 'repeating-linear-gradient(90deg, #b45309 0px, #b45309 20px, #1c1a14 20px, #1c1a14 40px)',
            }}
          />
        </div>

        {/* Caption beneath card */}
        <p className="font-coptic text-[10px] tracking-widest uppercase text-stone-400 mt-5 opacity-60">
          Mavuno Church — Open Church Management
        </p>
      </div>
    </>
  );
}

export default ComingSoon;