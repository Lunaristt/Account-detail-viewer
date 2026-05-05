"use client";
import { useState } from "react";

export default function PostCard({ post }: { post: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid #ddd", borderRadius: "8px",
      padding: "12px 16px", marginBottom: "8px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
        onClick={() => setOpen(!open)}>
        <p style={{ margin: 0, fontWeight: "500", flex: 1 }}>{post.title}</p>
        <span style={{ marginLeft: "12px", color: "#888" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <p style={{ margin: "12px 0 0", color: "#555", lineHeight: "1.6" }}>{post.body}</p>
      )}
    </div>
  );
}