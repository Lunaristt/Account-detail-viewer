"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import Link from "next/link";
import "./users-list.css";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line wide" />
      <div className="skeleton-line medium" />
      <div className="skeleton-stats">
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
      </div>
      <div className="skeleton-btn" />
    </div>
  );
}

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

  return (
    <div className="page-root">
      <header className="page-header">
        <div className="header-left">
          <span className="header-tag">OPS</span>
          <h1 className="header-title">User Operations</h1>
        </div>
        {!isLoading && !hasError && (
          <span className="header-count">{filteredUsers.length} users</span>
        )}
      </header>

      <div className="controls">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users"
          />
        </div>
        <select
          className="select-control"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort users"
        >
          <option value="name-asc">Name A→Z</option>
          <option value="name-desc">Name Z→A</option>
          <option value="most-pending">Most pending</option>
          <option value="most-posts">Most posts</option>
        </select>
        <select
          className="select-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter users"
        >
          <option value="all">All users</option>
          <option value="has-pending">Has pending</option>
          <option value="no-completed">No completed</option>
        </select>
      </div>

      {hasError && (
        <div className="state-error">
          <span className="state-icon">✕</span>
          <p>Failed to load users. Please try again.</p>
        </div>
      )}

      {isLoading && !hasError && (
        <div className="card-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!isLoading && !hasError && filteredUsers.length === 0 && (
        <div className="state-empty">
          <span className="state-icon">◎</span>
          <p>No users match your current filters.</p>
          <button className="reset-btn" onClick={() => { setSearch(""); setFilter("all"); }}>
            Reset filters
          </button>
        </div>
      )}

      {!isLoading && !hasError && filteredUsers.length > 0 && (
        <div className="card-grid">
          {filteredUsers.map((user: any) => (
            <div className="user-card" key={user.id}>
              <div className="card-body">
                <p className="card-name">{user.name}</p>
                <p className="card-email">{user.email}</p>
                <div className="card-stats">
                  <span className="stat">
                    <span className="stat-val">{user.totalPosts}</span>
                    <span className="stat-label">posts</span>
                  </span>
                  <span className="stat-divider" />
                  <span className="stat stat--green">
                    <span className="stat-val">{user.completedTodos}</span>
                    <span className="stat-label">done</span>
                  </span>
                  <span className="stat-divider" />
                  <span className={`stat ${user.pendingTodos > 0 ? "stat--amber" : ""}`}>
                    <span className="stat-val">{user.pendingTodos}</span>
                    <span className="stat-label">pending</span>
                  </span>
                </div>
              </div>
              <Link href={`/users/${user.id}`} className="card-link" aria-label={`View details for ${user.name}`}>
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}