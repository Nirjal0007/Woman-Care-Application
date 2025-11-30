import { useEffect, useState } from "react";
import { getPosts, getUsers, updateUser } from "../utils/api";
import PostCard from "../components/PostCard";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [posts, setPosts] = useState([]);
  const [favPosts, setFavPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Add TAB state (posts / favs)
  const [tab, setTab] = useState("posts"); // default is Your Posts

  useEffect(() => {
    async function loadData() {
      const [allPosts, allUsers] = await Promise.all([getPosts(), getUsers()]);
      setUsers(allUsers);

      const enrich = (p) => {
        const author = allUsers.find((u) => u.id === p.authorId) || {};
        return {
          ...p,
          authorName: author.name || "Unknown User",
          authorAvatar: author.avatar || null,
          comments: Array.isArray(p.comments) ? p.comments : [],
          likes: Array.isArray(p.likes) ? p.likes : [],
          favs: Array.isArray(p.favs) ? p.favs : [],
        };
      };

      const myPosts = allPosts.filter((p) => p.authorId === user?.id).map(enrich);
      const favs = allPosts.filter((p) => p.favs?.includes(user?.id)).map(enrich);

      setPosts(myPosts);
      setFavPosts(favs);
    }

    if (user) loadData();
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const updated = await updateUser(user.id, { ...user, name, bio });
      localStorage.setItem("currentUser", JSON.stringify(updated));
      setUser(updated);
      setName(updated.name);
      setBio(updated.bio);
      setMsg("✅ Profile updated!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMsg("❌ Update failed.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 2500);
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:8080/api/users/upload-avatar/${user.id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, avatar: data.avatar };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Failed upload:", err);
    }
  }

  async function removeFavourite(post) {
    try {
      const updatedPost = {
        ...post,
        favs: post.favs.filter((id) => id !== user.id),
      };

      await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      setFavPosts(favPosts.filter((p) => p.id !== post.id));
    } catch (err) {
      console.error("Failed to remove favourite:", err);
    }
  }

  const getAuthor = (id) => users.find((u) => u.id === id);

  if (!user) return <p>Please log in.</p>;

  return (
    <section className="profile-section" style={{ maxWidth: 700, margin: "0 auto" }}>
      
      {/* ---- PROFILE HEADER ---- */}
      <div className="profile-header card"
        style={{ display: "flex", justifyContent: "space-between", padding: "1rem", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {user.avatar ? (
            <img
              src={`http://localhost:8080/uploads/${user.avatar}`}
              alt=""
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "1rem",
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "1rem",
                fontSize: "1.5rem",
              }}
            >
              {user.name?.charAt(0) || "U"}
            </div>
          )}

          <div>
            <h2>{user.name}</h2>
            <p style={{ color: "gray" }}>@{user.username}</p>
            <p>{user.bio || "No bio yet."}</p>
          </div>
        </div>

        <button
          className="btn secondary"
          style={{
            padding: "6px 12px",
            fontSize: "0.8rem",
            borderRadius: "6px",
            height: "fit-content",
          }}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* ---- EDIT FORM ---- */}
      {editing && (
        <form className="card form" onSubmit={saveProfile} style={{ padding: "1rem" }}>
          <label>Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Bio</label>
          <textarea className="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />

          <label>Profile Picture</label>
          <input type="file" accept="image/*" onChange={uploadAvatar} />

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {msg && <div style={{ textAlign: "center", marginBottom: "1rem" }}>{msg}</div>}

      {/* ⭐⭐ TABS FOR POSTS / FAVS ⭐⭐ */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          className="btn secondary"
          onClick={() => setTab("posts")}
          style={{ background: tab === "posts" ? "#ddd" : "" }}
        >
          Your Posts
        </button>

        <button
          className="btn secondary"
          onClick={() => setTab("favs")}
          style={{ background: tab === "favs" ? "#ddd" : "" }}
        >
          Favourite Posts
        </button>
      </div>

      {/* ⭐⭐ FAVOURITE POSTS ⭐⭐ */}
{tab === "favs" && (
  <>
    <h3 style={{ marginTop: "1rem" }}>❤️ Your Favourite Posts</h3>

    {favPosts.length === 0 ? (
      <p style={{ color: "gray" }}>No favourite posts yet.</p>
    ) : (
      favPosts.map((post) => {
        const author = getAuthor(post.authorId);

        return (
          <div
            key={post.id}
            className="card"
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              position: "relative",
              border: "1px solid #ddd",
            }}
          >
            <button
              className="btn danger"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: "5px 10px",
                fontSize: "0.75rem",
              }}
              onClick={() => removeFavourite(post)}
            >
              Remove
            </button>

            {/* AUTHOR INFO */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              {author?.avatar ? (
                <img
                  src={`http://localhost:8080/uploads/${author.avatar}`}
                  alt=""
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    background: "#ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  {author?.name?.charAt(0) || "U"}
                </div>
              )}

              <span style={{ fontWeight: "bold" }}>@{author?.name || "Unknown"}</span>
            </div>

            {/* ⭐ TITLE ON TOP ⭐ */}
            <h4 style={{ marginBottom: "0.5rem" }}>{post.title}</h4>

            <p style={{ marginBottom: "0.8rem" }}>{post.body}</p>

            {/* ⭐ IMAGE AT BOTTOM WITH BETTER CSS ⭐ */}
            {post.image && (
              <img
                src={`http://localhost:8080/uploads/${post.image}`}
                alt=""
                style={{
                     width: "100%",
                      maxWidth: "400px",
                      maxHeight: "3500px",
                      objectFit: "contain",
                      borderRadius: "12px",
                      margin: "0.5rem 0",
                      display: "block",
                      border: "0.1px solid #9d9b9b",
                }}
              />
            )}
          </div>
        );
      })
    )}
  </>
)}

      {/* ⭐⭐ YOUR POSTS ⭐⭐ */}
      {tab === "posts" && (
        <>
          <h3 style={{ marginTop: "2rem" }}>Your Posts</h3>

          {posts.length === 0 ? (
            <p style={{ color: "gray" }}>No posts yet.</p>
          ) : (
            posts.map((p) => (
              <div key={p.id} style={{ marginBottom: "1rem" }}>
                <PostCard post={p} posts={posts} setPosts={setPosts} editable={true} />
              </div>
            ))
          )}
        </>
      )}
    </section>
  );
}
