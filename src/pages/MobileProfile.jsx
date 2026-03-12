import { useState } from "react";

const useAuthStore = () => ({
  user: {
    displayName: "Nathan Mwangi",
    email: "nathan@mavunochurch.org",
    photoURL: null,
    role: "Admin",
    joinDate: "March 2022",
    department: "Tech Ministry",
    phone: "+254 712 345 678",
  },
  logout: () => console.log("logout"),
});

const Avatar = ({ user, size = 80 }) => {
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: user.photoURL
          ? `url(${user.photoURL}) center/cover`
          : "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(217, 119, 6, 0.5)",
        boxShadow: "0 0 0 1px rgba(217,119,6,0.2), 0 4px 20px rgba(0,0,0,0.4)",
        flexShrink: 0,
      }}
    >
      {!user.photoURL && (
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: size * 0.35,
            fontWeight: 600,
            color: "#fef3c7",
            letterSpacing: "0.05em",
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const colors = {
    Admin: { bg: "rgba(146, 64, 14, 0.35)", border: "rgba(217,119,6,0.5)", text: "#fbbf24" },
    Leader: { bg: "rgba(30, 58, 138, 0.35)", border: "rgba(96,165,250,0.4)", text: "#93c5fd" },
    Member: { bg: "rgba(20, 83, 45, 0.35)", border: "rgba(74,222,128,0.4)", text: "#86efac" },
  };
  const c = colors[role] || colors.Member;
  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {role}
    </span>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "13px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <span style={{ fontSize: 16, opacity: 0.6, marginTop: 1, flexShrink: 0 }}>{icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 11,
          color: "rgba(251,191,36,0.6)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15,
          color: "#f5f0e8",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, variant = "default" }) => {
  const [pressed, setPressed] = useState(false);
  const isDanger = variant === "danger";

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: pressed
          ? isDanger ? "rgba(220,38,38,0.18)" : "rgba(217,119,6,0.12)"
          : "transparent",
        border: "none",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s ease",
        borderRadius: 0,
      }}
    >
      <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16,
          fontWeight: 500,
          color: isDanger ? "#f87171" : "#f5f0e8",
          letterSpacing: "0.02em",
          flex: 1,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>›</span>
    </button>
  );
};

const Divider = ({ label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "20px 0 8px",
    }}
  >
    <div style={{ flex: 1, height: 1, background: "rgba(217,119,6,0.2)" }} />
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(251,191,36,0.45)",
      }}
    >
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: "rgba(217,119,6,0.2)" }} />
  </div>
);

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1410",
        position: "relative",
        overflowX: "hidden",
        fontFamily: "'Cormorant Garamond', serif",

        // Only show on mobile
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media (min-width: 769px) {
          .profile-mobile-only { display: none !important; }
        }

        .profile-scroll::-webkit-scrollbar { display: none; }
        .profile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient background glow */}
      <div
        style={{
          position: "fixed",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(146,64,14,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="profile-scroll"
        style={{
          position: "relative",
          zIndex: 1,
          overflowY: "auto",
          height: "100vh",
          paddingBottom: 80, // space for mobile nav
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "56px 24px 24px",
            borderBottom: "1px solid rgba(217,119,6,0.15)",
            background: "linear-gradient(180deg, rgba(26,18,8,0.95) 0%, transparent 100%)",
          }}
        >
          {/* Church name */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(251,191,36,0.4)",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Mavuno Church · OCM
          </div>

          {/* Avatar + name block */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar user={user} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#fef3c7",
                  letterSpacing: "0.01em",
                  lineHeight: 1.15,
                  marginBottom: 6,
                }}
              >
                {user.displayName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <RoleBadge role={user.role} />
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(245,240,232,0.4)",
                    fontStyle: "italic",
                  }}
                >
                  {user.department}
                </span>
              </div>
            </div>
          </div>

          {/* Edit profile button */}
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              marginTop: 18,
              width: "100%",
              padding: "10px 0",
              background: "rgba(217,119,6,0.12)",
              border: "1px solid rgba(217,119,6,0.35)",
              borderRadius: 8,
              color: "#fbbf24",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* Main content */}
        <div style={{ padding: "0 20px" }}>

          {/* Member Info */}
          <Divider label="Member Information" />
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "0 16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <InfoRow icon="✉️" label="Email" value={user.email} />
            <InfoRow icon="📱" label="Phone" value={user.phone} />
            <InfoRow icon="🏛️" label="Ministry" value={user.department} />
            <InfoRow icon="📅" label="Member Since" value={user.joinDate} />
          </div>

          {/* Quick Actions */}
          <Divider label="Account" />
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <ActionButton icon="🔔" label="Notifications" onClick={() => {}} />
            <ActionButton icon="🔒" label="Privacy & Security" onClick={() => {}} />
            <ActionButton icon="🎨" label="Appearance" onClick={() => {}} />
            <ActionButton icon="❓" label="Help & Support" onClick={() => {}} />
          </div>

          {/* Church */}
          <Divider label="Church" />
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <ActionButton icon="📖" label="My Groups" onClick={() => {}} />
            <ActionButton icon="🙏" label="Prayer Requests" onClick={() => {}} />
            <ActionButton icon="💰" label="Giving History" onClick={() => {}} />
            <ActionButton icon="📋" label="Attendance Record" onClick={() => {}} />
          </div>

          {/* Danger zone */}
          <Divider label="Session" />
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              marginBottom: 12,
            }}
          >
            <ActionButton icon="🚪" label="Sign Out" onClick={logout} variant="danger" />
          </div>

          {/* Version */}
          <div
            style={{
              textAlign: "center",
              padding: "12px 0 8px",
              fontSize: 11,
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "0.1em",
            }}
          >
            OCM v1.0 · Mavuno Church
          </div>
        </div>
      </div>
    </div>
  );
}