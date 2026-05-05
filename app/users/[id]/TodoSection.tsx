"use client";
import { useState } from "react";

export default function TodoSection({ title, todos, color }: { title: string, todos: any[], color: string }) {
  const [open, setOpen] = useState(false);
  if (todos.length === 0) return null;
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        onClick={() => setOpen(!open)}>
        <h3 style={{ margin: 0, color }}>{title} ({todos.length})</h3>
        <span style={{ color: "#888" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          {todos.map((todo: any) => (
            <li key={todo.id} style={{ marginBottom: "6px", color: "#555" }}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}