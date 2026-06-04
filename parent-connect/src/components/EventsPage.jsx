import { useState, useMemo } from "react";
import { events, categories } from "../data/events";
import EventCard from "./EventCard";
import EventModal from "./EventModal";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchCat = category === "All" || e.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.culture.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const upcoming = filtered.filter((e) => new Date(e.date) >= new Date("2026-06-14"));
  const rsvpdEvents = events.filter((e) => e.rsvpd);

  return (
    <div className="events-page">
      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Find Your Community 🌏</h1>
        <p className="hero-sub">Connect with parents, celebrate cultures, make memories</p>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search events, cultures, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* My RSVPs strip */}
      {rsvpdEvents.length > 0 && (
        <section className="section">
          <h2 className="section-title">Your Upcoming RSVPs 🎉</h2>
          <div className="rsvp-strip">
            {rsvpdEvents.map((e) => (
              <button key={e.id} className="rsvp-chip" onClick={() => setSelected(e)}>
                <span>{e.emoji}</span>
                <span className="rsvp-chip-text">{e.title}</span>
                <span className="rsvp-chip-date">
                  {new Date(e.date + "T00:00:00").toLocaleDateString("default", { month: "short", day: "numeric" })}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Category filter */}
      <div className="filter-row">
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c === "All" && "✨ "}
            {c === "Cultural Festival" && "🎉 "}
            {c === "Exercise" && "🏃 "}
            {c === "Social" && "☕ "}
            {c === "Activity" && "🎨 "}
            {c}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <section className="section">
        <div className="section-row">
          <h2 className="section-title">Upcoming Events</h2>
          <span className="count-badge">{upcoming.length}</span>
        </div>
        {upcoming.length === 0 ? (
          <div className="empty-state">
            <span>🔎</span>
            <p>No events match your search. Try a different filter!</p>
          </div>
        ) : (
          <div className="events-grid">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} onClick={() => setSelected(e)} />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <EventModal event={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
