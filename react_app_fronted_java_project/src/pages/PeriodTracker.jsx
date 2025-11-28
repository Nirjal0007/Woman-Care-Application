import { useEffect, useMemo, useState } from "react";
import { getCycles, addCycle, deleteCycle } from "../utils/api";

export default function PeriodTracker() {
  const me = JSON.parse(localStorage.getItem("currentUser"));
  const [date, setDate] = useState("");
  const [length, setLength] = useState(28);
  const [note, setNote] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const cycles = await getCycles();
        const userCycles = cycles.filter(c => c.userId === me.id);
        setList(userCycles);
      } catch (err) {
        console.error("Failed to load cycles:", err);
      }
    }
    load();
  }, [me.id]);

  async function add(e) {
    e.preventDefault();
    if (!date) return;

    const item = {
      userId: me.id,
      startDate: date,
      length: Number(length),
      notes: note,
      createdAt: Date.now(),
    };

    try {
      const saved = await addCycle(item);
      setList(prev => [...prev, saved]);
      setDate("");
      setNote("");
      setLength(28);
    } catch (err) {
      console.error("Failed to save cycle:", err);
    }
  }

  // new delete handler
  async function remove(id) {
    const ok = await deleteCycle(id);
    if (ok) {
      setList(prev => prev.filter(c => c.id !== id));
    }
  }

  const avg = useMemo(() => {
    if (list.length === 0) return 28;
    const sum = list.reduce((a, b) => a + (b.length || 28), 0);
    return Math.round(sum / list.length);
  }, [list]);

  const lastDate = list.length ? new Date(list[list.length - 1].startDate) : null;
  const nextDate = lastDate ? new Date(lastDate.getTime() + avg * 24 * 60 * 60 * 1000) : null;

  return (
    <section>
      <h1 className="h1">Period Tracker</h1>
      <div className="muted">
        Average cycle (based on your logs): <b>{avg} days</b>
      </div>
      {nextDate && (
        <div className="muted">
          Estimated next period: <b>{nextDate.toDateString()}</b>
        </div>
      )}

      <form className="card form" onSubmit={add}>
        <label>Cycle start date</label>
        <input
          className="input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <label>Cycle length (days)</label>
        <input
          className="input"
          type="number"
          min="15"
          max="60"
          value={length}
          onChange={e => setLength(e.target.value)}
        />

        <textarea
          className="textarea"
          rows={2}
          placeholder="Notes / symptoms (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <button className="btn primary" type="submit">Add entry</button>
      </form>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>History</h3>
        <ul className="history">
          {list.map(c => (
            <li key={c.id}>
              <b>{new Date(c.startDate).toDateString()}</b> — {c.length} days{" "}
              {c.notes && <>• {c.notes}</>}
              
              {/* DELETE BUTTON (small, aligned, no UI change) */}
              <button
                style={{
                  float: "right",
                  background: "transparent",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => remove(c.id)}
              >
                ✕
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="muted">No entries yet.</li>}
        </ul>
      </div>
    </section>
  );
}
