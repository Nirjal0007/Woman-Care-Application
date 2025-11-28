import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// USERS
export async function registerUser(data) {
  const res = await API.post("/users", data);
  return res.data;
}

export async function loginUser(username, password) {
  const res = await API.get(`/users`);
  const users = res.data;
  return users.find(
    (u) => u.username === username && u.password === password
  );
}

export async function getUsers() {
  const res = await API.get("/users");
  return res.data;
}

export async function updateUser(id, data) {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
}

export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/users/upload-avatar/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// POSTS
export async function getPosts() {
  const res = await API.get("/posts");
  return res.data;
}

/**
 * Add a new post.
 */
export async function addPost(data) {
  if (data.image instanceof File) {
    const formData = new FormData();
    formData.append("authorId", data.authorId);
    formData.append("authorName", data.authorName);
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("image", data.image);

    const res = await API.post("/posts/add-with-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } else {
    // no image, normal JSON post
    const res = await API.post("/posts", data);
    return res.data;
  }
}

export async function updatePost(id, data) {
  const res = await API.put(`/posts/${id}`, data);
  return res.data;
}

export async function deletePost(id) {
  await API.delete(`/posts/${id}`);
}

// MOODS
export async function getMoods() {
  const res = await API.get("/moods");
  return res.data;
}

export async function addMood(data) {
  const res = await API.post("/moods", data);
  return res.data;
}

export async function deleteMood(id) {
  const res = await API.delete(`/moods/${id}`);
  return res.data;
}

// CYCLES
export async function getCycles() {
  const res = await API.get("/cycles");
  return res.data;
}

export async function addCycle(data) {
  const res = await API.post("/cycles", data);
  return res.data;
}

export async function deleteCycle(id) {
  const res = await fetch(`http://localhost:8080/api/cycles/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete cycle");
  }
  return true;
}

// COMMENTS
export async function getCommentsByPost(postId) {
  const res = await API.get(`/comments/post/${postId}`);
  return res.data;
}

export async function getReplies(parentId) {
  const res = await API.get(`/comments/replies/${parentId}`);
  return res.data;
}

export async function addCommentToPost(comment) {
  const res = await API.post(`/comments`, comment);
  return res.data;
}

export async function deleteComment(id) {
  const res = await API.delete(`/comments/${id}`);
  return res.data;
}
