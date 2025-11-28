import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "../utils/storage";
import "../Chatbot.css";

export default function Chatbot() {
  const me = getCurrentUser();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  // Load chat history from backend
  useEffect(() => {
    fetch(`http://localhost:8080/api/chats/user/${me.id}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [me.id]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message with 3s bot delay
  async function send(textOverride = null) {
    const text = (textOverride ?? draft).trim();
    if (!text) return;

    setDraft("");
    setIsTyping(true);

    // Save user message first
    const userMsg = {
      userId: me.id,
      message: text,
      fromUser: true,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Wait 3 seconds before bot reply
    setTimeout(async () => {
      const res = await fetch("http://localhost:8080/api/chats/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMsg),
      });
      const data = await res.json(); // [userMsgSaved, botMsg]
      setMessages(prev => {
        // Remove duplicate user message and add backend messages
        const filtered = prev.filter(m => m.timestamp !== userMsg.timestamp);
        return [...filtered, ...data];
      });
      setIsTyping(false);
    }, 3000);
  }

  function onKey(e) {
    if (e.key === "Enter") send();
  }

  return (
    <section className="chat">
      <h1 className="h1">Chatbot</h1>

      {/* Quick buttons */}
      <div className="card quick-buttons">
        <button className="btn" onClick={() => send("period tips")}>Period tips</button>
        <button className="btn" onClick={() => send("mood help")}>Mood help</button>
        <button className="btn" onClick={() => send("sleep routine")}>Sleep</button>
        <button className="btn" onClick={() => send("diet advice")}>Diet</button>
        <button className="btn" onClick={() => send("exercise")}>Exercise</button>
        <button className="btn" onClick={() => send("stress")}>Stress</button>
      </div>

      {/* Chat area */}
      <div className="chatbox">
        {messages.map(m => (
          <div key={m.timestamp} className={`bubble ${m.fromUser ? "mine" : "theirs"}`}>
            <div className="bubble-text">{m.message}</div>
          </div>
        ))}

        {isTyping && (
          <div className="bubble theirs typing">
            <div className="bubble-text">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="composer">
        <input
          className="input grow"
          placeholder="Ask me anything…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="btn primary" onClick={() => send()}>Send</button>
      </div>
    </section>
  );
}
