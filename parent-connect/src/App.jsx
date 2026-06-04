import { useState } from "react";
import Header from "./components/Header";
import EventsPage from "./components/EventsPage";
import PlaceholderPage from "./components/PlaceholderPage";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("Events");
  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main">
        {activeTab === "Events" && <EventsPage />}
        {activeTab !== "Events" && <PlaceholderPage tab={activeTab} />}
      </main>
    </div>
  );
}
