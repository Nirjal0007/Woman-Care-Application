import { useEffect, useState } from "react";
import { getPosts, getUsers } from "../utils/api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(""); // search text

  const me = JSON.parse(localStorage.getItem("currentUser"));

  // Load posts & users
  useEffect(() => {
    async function load() {
      try {
        const [postsData, usersData] = await Promise.all([getPosts(), getUsers()]);
        const list = postsData.map((p) => {
          const author = usersData.find((u) => u.id === p.authorId) || {};
          return {
            ...p,
            authorName: author.name || "Unknown User",
            authorAvatar: author.avatar || null,
            comments: Array.isArray(p.comments) ? p.comments : [],
            likes: Array.isArray(p.likes) ? p.likes : [],
            favs: Array.isArray(p.favs) ? p.favs : [],
          };
        });
        setPosts(list.sort((a, b) => b.createdAt - a.createdAt));
      } catch (err) {
        console.error("❌ Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Watch localStorage search changes — LIVE SEARCH
  useEffect(() => {
    // Load initial search
    setSearch(localStorage.getItem("search") || "");

    // Listen to changes
    function handleStorage(e) {
      if (e.key === "search") {
        setSearch(e.newValue || "");
      }
    }
    window.addEventListener("storage", handleStorage);

    // Small ticker so search updates instantly (React quirk)
    const interval = setInterval(() => {
      const s = localStorage.getItem("search") || "";
      setSearch(s);
    }, 300);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.body.toLowerCase().includes(search.toLowerCase()) ||
    p.authorName.toLowerCase().includes(search.toLowerCase())
  );

  // Publish post
  async function publish(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return alert("Title and body are required!");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("body", body.trim());
      formData.append("authorId", me.id);
      formData.append("authorName", me.name);

      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:8080/api/posts/add-with-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to publish post");

      const saved = await res.json();
      saved.authorAvatar = me.avatar || null;

      setPosts((prev) => [saved, ...prev]);
      setTitle("");
      setBody("");
      setImage(null);
    } catch (err) {
      console.error("❌ Error publishing post:", err);
      alert("Failed to publish post.");
    }
  }

  if (loading) return <div>Loading feed...</div>;

  const favCount = posts.filter((p) => p.favs?.includes(me.id)).length;

  return (
    <section>
      <h1 className="h1">News Feed</h1>
      <div className="muted">Your favourites: {favCount}</div>

      {/* New Post Form */}
      <form className="card form" onSubmit={publish}>
        <input
          className="input"
          placeholder="Title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          rows={3}
          placeholder="Share something helpful…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="btn primary" type="submit">
          Publish
        </button>
      </form>

      {/* Posts List */}
      <div>
        {filteredPosts.length === 0 ? (
          <p className="muted">No posts found.</p>
        ) : (
          filteredPosts.map((p) => (
            <div key={p.id} style={{ marginBottom: "1.25rem" }}>
              <PostCard post={p} posts={posts} setPosts={setPosts} editable={p.authorId === me.id} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
