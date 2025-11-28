import { useState } from "react";
import { createPost } from "../utils/api";

export default function CreatePost({ posts, setPosts }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const newPost = {
      title,
      body,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,   // ⭐ IMPORTANT FIX
      likes: [],
      favs: [],
    };

    try {
      const saved = await createPost(newPost);

      // ⭐ Update immediately in UI (no refresh required)
      setPosts([saved, ...posts]);

      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Write something…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <button className="btn">Post</button>
    </form>
  );
}
