import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadAvatar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/upload-avatar/${user.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      user.avatar = res.data.avatar;
      localStorage.setItem("currentUser", JSON.stringify(user));

      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Set Up Your Profile Picture</h2>

        <label style={styles.uploadBox}>
          {preview ? (
            <img src={preview} alt="preview" style={styles.previewImg} />
          ) : (
            <div style={styles.placeholder}>
              <span style={styles.plus}>+</span>
              <p>Select Image</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>

        <div style={styles.btnRow}>
          <button style={styles.uploadBtn} onClick={handleUpload}>
            Upload
          </button>
          <button style={styles.skipBtn} onClick={() => navigate("/feed")}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f6f7fb"
  },

  card: {
    width: "350px",
    background: "#fff",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
  },

  uploadBox: {
    width: "150px",
    height: "150px",
    margin: "0 auto 25px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px dashed #c9c9c9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.3s",
  },

  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  placeholder: {
    textAlign: "center",
    color: "#888",
  },

  plus: {
    fontSize: "40px",
    fontWeight: "300",
    display: "block",
    marginBottom: "5px",
  },

  btnRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  uploadBtn: {
    padding: "10px 20px",
    background: "#ff4f8a",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    width: "48%",
    transition: "0.2s",
  },

  skipBtn: {
    padding: "10px 20px",
    background: "#e0e0e0",
    border: "none",
    color: "#333",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    width: "48%",
    transition: "0.2s",
  },
};
