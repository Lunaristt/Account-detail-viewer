"use client";
import { useState } from "react";

export default function TodoSection({ title, todos, color }: { title: string, todos: any[], color: string }) {
  const [open, setOpen] = useState(false);
  if (todos.length === 0) return null;
  return (
    <div style={{ borderBottom: "1px solid #1e1e1e" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#888",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
        }}
      >
        <span style={{ color }}>{title} <span style={{ color: "#444" }}>({todos.length})</span></span>
        <span style={{ color: "#333" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul style={{ margin: 0, padding: "0 16px 12px 32px", listStyle: "none" }}>
          {todos.map((todo: any) => (
            <li key={todo.id} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              color: "#555",
              padding: "4px 0",
              borderBottom: "1px solid #1a1a1a",
            }}>
              {todo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}