export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <span className="logo-icon">🌏</span>
          <span className="logo-text">ParentConnect</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications">
            <span>🔔</span>
            <span className="badge">3</span>
          </button>
          <div className="avatar" aria-label="Profile">NP</div>
        </div>
      </div>
      <nav className="tab-nav">
        {["Events", "Groups", "Messages", "Profile"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon">
              {tab === "Events" && "📅"}
              {tab === "Groups" && "👥"}
              {tab === "Messages" && "💬"}
              {tab === "Profile" && "👤"}
            </span>
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
}
