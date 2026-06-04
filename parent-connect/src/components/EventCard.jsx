import { useState } from "react";

export default function EventCard({ event, onClick }) {
  const [rsvpd, setRsvpd] = useState(event.rsvpd);
  const [count, setCount] = useState(event.attendees);

  const pct = Math.round((count / event.capacity) * 100);
  const spotsLeft = event.capacity - count;

  function handleRsvp(e) {
    e.stopPropagation();
    if (!rsvpd) {
      setCount((c) => c + 1);
    } else {
      setCount((c) => c - 1);
    }
    setRsvpd((r) => !r);
  }

  const dateObj = new Date(event.date + "T00:00:00");
  const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = dateObj.getDate();

  return (
    <article className="event-card" onClick={onClick}>
      <div className="event-img-wrap">
        <img src={event.image} alt={event.title} className="event-img" loading="lazy" />
        <span className="event-culture-badge">{event.emoji} {event.culture}</span>
        <div className="event-date-chip">
          <span className="chip-month">{month}</span>
          <span className="chip-day">{day}</span>
        </div>
      </div>
      <div className="event-body">
        <span className="event-category">{event.category}</span>
        <h3 className="event-title">{event.title}</h3>
        <div className="event-meta">
          <span>🕐 {event.time}</span>
          <span>📍 {event.location}</span>
        </div>
        <div className="event-host">
          <div className="mini-avatar">{event.hostAvatar}</div>
          <span>Hosted by {event.host}</span>
        </div>
        <div className="event-tags">
          {event.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="event-footer">
          <div className="attendee-info">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="spots-text">
              {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
            </span>
          </div>
          <button
            className={`rsvp-btn ${rsvpd ? "rsvpd" : ""}`}
            onClick={handleRsvp}
            disabled={!rsvpd && spotsLeft === 0}
          >
            {rsvpd ? "✓ Going" : "RSVP"}
          </button>
        </div>
      </div>
    </article>
  );
}
