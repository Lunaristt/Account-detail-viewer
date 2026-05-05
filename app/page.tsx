"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import Link from "next/link";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export default function Page() {
  const { data: users, error: usersError } = useSWR("https://jsonplaceholder.typicode.com/users", fetcher);
  const { data: posts, error: postsError } = useSWR("https://jsonplaceholder.typicode.com/posts", fetcher);
  const { data: todos, error: todosError } = useSWR("https://jsonplaceholder.typicode.com/todos", fetcher);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [filter, setFilter] = useState("all");

  const isLoading = !users || !posts || !todos;
  const hasError = usersError || postsError || todosError;

  const enrichedUsers = useMemo(() => {
    if (!users || !posts || !todos) return [];

    return users.map((user: any) => ({
      ...user,
      totalPosts: posts.filter((p: any) => p.userId === user.id).length,
      completedTodos: todos.filter((t: any) => t.userId === user.id && t.completed).length,
      pendingTodos: todos.filter((t: any) => t.userId === user.id && !t.completed).length,
    }));
  }, [users, posts, todos]);

  const filteredUsers = useMemo(() => {
    let result = enrichedUsers.filter((user: any) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "has-pending") result = result.filter((u: any) => u.pendingTodos > 0);
    if (filter === "no-completed") result = result.filter((u: any) => u.completedTodos === 0);

    result.sort((a: any, b: any) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "most-pending") return b.pendingTodos - a.pendingTodos;
      if (sortBy === "most-posts") return b.totalPosts - a.totalPosts;
      return 0;
    });

    return result;
  }, [enrichedUsers, search, sortBy, filter]);

  if (isLoading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (hasError) return <p style={{ padding: "20px" }}>Error loading data.</p>;

  return (
    <div style={{ padding: "20px", margin: "0 auto" }}>
      <h1>User Operations</h1>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: "1", minWidth: "200px" }}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px" }}>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="most-pending">Most pending todos</option>
          <option value="most-posts">Most posts</option>
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px" }}>
          <option value="all">All users</option>
          <option value="has-pending">Has pending todos</option>
          <option value="no-completed">No completed todos</option>
        </select>
      </div>

      {filteredUsers.length === 0 && (
        <p style={{ color: "#888" }}>No users match your filter.</p>
      )}

      {/* Cards */}
      <div className="card-grid">
        {filteredUsers.map((user: any) => (
          <div key={user.id} className="user-card">
            <div>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>{user.name}</p>
              <p style={{ margin: "4px 0 12px", color: "#666", fontSize: "14px" }}>{user.email}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                <span>📝 {user.totalPosts} posts</span>
                <span style={{ color: "green" }}>✓ {user.completedTodos} done</span>
                <span style={{ color: user.pendingTodos > 0 ? "orange" : "gray" }}>
                  ⏳ {user.pendingTodos} pending
                </span>
              </div>
            </div>
            <Link href={`/users/${user.id}`} style={{
              display: "block",
              marginTop: "16px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              textAlign: "center",
            }}>
              View →
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        .card-grid {
          display: grid;
          grid-template-columns: 2fr;
          gap: 12px;
        }
        .user-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 640px) {
          .card-grid {
            grid-template-columns: repeat(7, 1fr);
          }
        }
      `}</style>
    </div>
  );
}