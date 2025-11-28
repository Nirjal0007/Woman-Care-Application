import { useEffect, useState } from "react";
import { addMood, getMoods, deleteMood } from "../utils/api";

export default function MentalHealth() {
  const [moods, setMoods] = useState([]);
  const [note, setNote] = useState("");
  const [moodType, setMoodType] = useState("");
  const [score, setScore] = useState(3);
  const me = JSON.parse(localStorage.getItem("currentUser"));

  // 👉 Add this
  function formatDate(ms) {
    return new Date(ms).toLocaleString();
  }

  useEffect(() => {
    async function load() {
      const all = await getMoods();
      setMoods(all.filter(m => m.userId === me.id).sort((a, b) => b.timestamp - a.timestamp));
    }
    load();
  }, [me.id]);

  async function saveMood(e) {
    e.preventDefault();
    if (!moodType) return;

    const newMood = {
      userId: me.id,
      moodType,
      note,
      score: Number(score),
      timestamp: Date.now(),
    };

    try {
      const saved = await addMood(newMood);
      setMoods([saved, ...moods]);
      setMoodType("");
      setNote("");
      setScore(3);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeMood(id) {
    if (!window.confirm("Delete this mood entry?")) return;
    try {
      await deleteMood(id);
      setMoods(moods.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section>
      <h1 className="h1">Self-Care — Mood Journal</h1>

      <form className="card form" onSubmit={saveMood}>
        <label>How do you feel today?</label>
        <select className="input" value={moodType} onChange={e => setMoodType(e.target.value)}>
          <option value="">Select mood…</option>
          <option value="Happy">😊 Happy</option>
          <option value="Sad">😔 Sad</option>
          <option value="Stressed">😤 Stressed</option>
          <option value="Tired">😴 Tired</option>
        </select>

        <label>Mood score (1-5)</label>
        <input className="input" type="number" min="1" max="5" value={score} onChange={e => setScore(e.target.value)} />

        <textarea className="textarea" rows={2} placeholder="Notes…" value={note} onChange={e => setNote(e.target.value)} />
        <button className="btn primary" type="submit">Save Mood</button>
      </form>

      <div className="grid">
        {moods.map(m => (
          <div key={m.id} className="card">
            <div><b>{m.moodType}</b> — Score: {m.score}/5</div>

            {/* 👉 Add this line */}
            <div className="muted">{formatDate(m.timestamp)}</div>

            {m.note && <div className="note-text">{m.note}</div>}
            <button className="btn ghost small" onClick={() => removeMood(m.id)}>Delete</button>
          </div>
        ))}
        {moods.length === 0 && <div className="muted">No entries yet.</div>}
      </div>
    </section>
  );
}
