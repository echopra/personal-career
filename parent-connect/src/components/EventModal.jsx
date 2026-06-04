import { useState } from "react";

export default function EventModal({ event, onClose }) {
  const [rsvpd, setRsvpd] = useState(event.rsvpd);
  const [count, setCount] = useState(event.attendees);

  if (!event) return null;

  const dateObj = new Date(event.date + "T00:00:00");
  const fullDate = dateObj.toLocaleDateString("default", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  function handleRsvp() {
    if (!rsvpd) setCount((c) => c + 1);
    else setCount((c) => c - 1);
    setRsvpd((r) => !r);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <img src={event.image} alt={event.title} className="modal-img" />
        <div className="modal-body">
          <div className="modal-header-row">
            <span className="event-culture-badge inline">{event.emoji} {event.culture}</span>
            <span className="event-category">{event.category}</span>
          </div>
          <h2 className="modal-title">{event.title}</h2>
          <div className="modal-details">
            <div className="detail-row"><span>📅</span><span>{fullDate}</span></div>
            <div className="detail-row"><span>🕐</span><span>{event.time}</span></div>
            <div className="detail-row"><span>📍</span><span>{event.location}</span></div>
            <div className="detail-row">
              <span>👥</span>
              <span>{count} attending · {event.capacity - count} spots left</span>
            </div>
          </div>
          <div className="modal-host">
            <div className="avatar-md">{event.hostAvatar}</div>
            <div>
              <div className="host-label">Hosted by</div>
              <div className="host-name">{event.host}</div>
            </div>
          </div>
          <p className="modal-description">{event.description}</p>
          <div className="event-tags modal-tags">
            {event.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="modal-actions">
            <button className="msg-btn">💬 Message Host</button>
            <button
              className={`rsvp-btn large ${rsvpd ? "rsvpd" : ""}`}
              onClick={handleRsvp}
              disabled={!rsvpd && event.capacity - count === 0}
            >
              {rsvpd ? "✓ You're Going!" : "RSVP to This Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
