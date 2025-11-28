
// Get the currently logged-in user (or create a guest user)
export function getCurrentUser() {
  try {
    const user = localStorage.getItem("currentUser");
    if (user) return JSON.parse(user);

    // If no user exists, create a default guest user
    const guest = { id: "guest", name: "Guest" };
    localStorage.setItem("currentUser", JSON.stringify(guest));
    return guest;
  } catch (err) {
    console.error("Error reading current user:", err);
    return { id: "guest", name: "Guest" };
  }
}

// Get all saved chat messages for a specific user
export function getChatsFor(userId) {
  try {
    const saved = localStorage.getItem(`chats_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Error reading chat messages:", err);
    return [];
  }
}

// Save chat messages for a specific user
export function saveChatsFor(userId, chats) {
  try {
    localStorage.setItem(`chats_${userId}`, JSON.stringify(chats));
  } catch (err) {
    console.error("Error saving chat messages:", err);
  }
}

// Optional helper to clear all chats (you can call this manually if needed)
export function clearChatsFor(userId) {
  try {
    localStorage.removeItem(`chats_${userId}`);
  } catch (err) {
    console.error("Error clearing chats:", err);
  }
}
