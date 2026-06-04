export default function PlaceholderPage({ tab }) {
  const config = {
    Groups: { icon: "👥", label: "Your Groups", sub: "Find exercise buddies and activity groups" },
    Messages: { icon: "💬", label: "Messages", sub: "Chat with hosts and other parents" },
    Profile: { icon: "👤", label: "Your Profile", sub: "Showcase your background and interests" },
  };
  const { icon, label, sub } = config[tab] || {};
  return (
    <div className="placeholder-page">
      <span className="placeholder-icon">{icon}</span>
      <h2>{label}</h2>
      <p>{sub}</p>
      <span className="coming-soon">Coming Soon</span>
    </div>
  );
}
