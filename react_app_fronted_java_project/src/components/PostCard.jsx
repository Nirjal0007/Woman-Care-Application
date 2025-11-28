import { useState } from "react";
import {
  updatePost,
  deletePost,
  addCommentToPost,
  deleteComment,
} from "../utils/api";

export default function PostCard({ post, posts, setPosts, editable }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  async function toggleLike() {
    const has = post.likes?.includes(user.id);
    const updated = {
      ...post,
      likes: has
        ? post.likes.filter((id) => id !== user.id)
        : [...(post.likes || []), user.id],
    };
    await updatePost(post.id, updated);
    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
  }

  async function toggleFav() {
    const has = post.favs?.includes(user.id);
    const updated = {
      ...post,
      favs: has
        ? post.favs.filter((id) => id !== user.id)
        : [...(post.favs || []), user.id],
    };
    await updatePost(post.id, updated);
    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
  }

  async function addComment() {
    const text = newComment.trim();
    if (!text) return;

    const newC = {
      postId: post.id,
      userId: user.id,
      authorName: user.name,
      text,
      parentId: null,
    };

    try {
      const saved = await addCommentToPost(newC);
      const updated = {
        ...post,
        comments: [...(comments || []), saved],
      };
      setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
      setComments(updated.comments);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    }
  }

  async function remove() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post.id);
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  }

  async function edit() {
    const title = window.prompt("Edit title", post.title) || post.title;
    const body = window.prompt("Edit content", post.body) || post.body;
    const updated = { ...post, title, body };
    await updatePost(post.id, updated);
    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
  }

  function toggleReplies(commentId) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, showReplies: !c.showReplies } : c
      )
    );
  }

  async function addReply(parentId, replyText) {
    const text = replyText.trim();
    if (!text) return;

    const newReply = {
      postId: post.id,
      userId: user.id,
      authorName: user.name,
      text,
      parentId,
    };

    try {
      const saved = await addCommentToPost(newReply);
      const updated = { ...post, comments: [...comments, saved] };
      setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
      setComments(updated.comments);
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to reply.");
    }
  }

  async function removeComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      const updatedComments = comments.filter(
        (c) => c.id !== commentId && c.parentId !== commentId
      );
      const updated = { ...post, comments: updatedComments };
      setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
      setComments(updatedComments);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  }

  return (
    <article
      className="card post"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {post.authorAvatar ? (
          <img
            src={`http://localhost:8080/uploads/${post.authorAvatar}`}
            alt="Avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "0.75rem",
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#222",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "0.75rem",
              fontWeight: "bold",
            }}
          >
            {post.authorName?.[0]?.toUpperCase()}
          </div>
        )}

        <div>
          <b>{post.authorName}</b>
          <div style={{ fontSize: "0.8rem", color: "#777" }}>{formattedDate}</div>
          <div style={{ color: "#888" }}>{post.title}</div>
        </div>

        <div style={{ flexGrow: 1 }} />

        {editable && (
          <>
            <button className="btn ghost" onClick={edit}>
              Edit
            </button>
            <button className="btn ghost" onClick={remove}>
              Delete
            </button>
          </>
        )}
      </div>

      <p style={{ margin: 0, color: "#333" }}>{post.body}</p>

      {/* ✅ ONLY THIS PART ADDED */}
      {post.image && (
        <img
          src={`http://localhost:8080/uploads/${post.image}`}
          alt="Post"
          className="post-image"
        />
      )}
      {/* -------------------------------- */}

      {/* Like + Fav + Comments */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className="btn" onClick={toggleLike}>
          ❤️ {post.likes?.length || 0}
        </button>
        <button className="btn" onClick={toggleFav}>
          ⭐ {post.favs?.length || 0}
        </button>
        <button className="btn" onClick={() => setShowComments(!showComments)}>
          💬 {comments.length}
        </button>
      </div>

      {showComments && (
        <div
          style={{
            marginTop: "0.5rem",
            borderTop: "1px solid #eee",
            paddingTop: "0.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
            <input
              className="input"
              placeholder="Write a comment…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn" onClick={addComment}>
              Post
            </button>
          </div>

          {comments.filter((c) => !c.parentId).length === 0 ? (
            <p style={{ color: "#777", marginLeft: "0.25rem" }}>
              No comments yet.
            </p>
          ) : (
            comments
              .filter((c) => !c.parentId)
              .map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  allComments={comments}
                  toggleReplies={toggleReplies}
                  addReply={addReply}
                  removeComment={removeComment}
                />
              ))
          )}
        </div>
      )}
    </article>
  );
}

function CommentItem({
  comment,
  allComments,
  toggleReplies,
  addReply,
  removeComment,
}) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const replies = allComments.filter((c) => c.parentId === comment.id);
  const [replyText, setReplyText] = useState("");
  const [replyBox, setReplyBox] = useState(false);

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          💬 <b>{comment.authorName}</b>: {comment.text}
        </div>

        {String(comment.userId) === String(user.id) && (
          <button
            style={{
              border: "none",
              background: "none",
              color: "red",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
            onClick={() => removeComment(comment.id)}
          >
            🗑
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "0.25rem",
          marginLeft: "1.5rem",
        }}
      >
        <button
          style={{
            border: "none",
            background: "none",
            color: "#007bff",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
          onClick={() => setReplyBox(!replyBox)}
        >
          Reply
        </button>

        {replies.length > 0 && (
          <button
            style={{
              border: "none",
              background: "none",
              color: "#007bff",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
            onClick={() => toggleReplies(comment.id)}
          >
            {comment.showReplies
              ? "Hide Replies"
              : `View Replies (${replies.length})`}
          </button>
        )}
      </div>

      {replyBox && (
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            marginTop: "0.25rem",
            marginLeft: "1.5rem",
          }}
        >
          <input
            className="input"
            placeholder="Write a reply…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              addReply(comment.id, replyText);
              setReplyText("");
              setReplyBox(false);
            }}
          >
            Send
          </button>
        </div>
      )}

      {comment.showReplies &&
        replies.map((r) => (
          <div
            key={r.id}
            style={{
              marginLeft: "2rem",
              background: "#f9f9f9",
              borderRadius: "8px",
              padding: "4px 8px",
              marginTop: "0.25rem",
            }}
          >
            💬 <b>{r.authorName}</b>: {r.text}
          </div>
        ))}
    </div>
  );
}
