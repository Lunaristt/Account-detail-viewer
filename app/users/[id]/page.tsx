import Link from "next/link";
import { notFound } from "next/navigation";
import TodoSection from "./TodoSection";
import "./user-detail.css";

async function fetchAll(id: string) {
  const [userRes, postsRes, todosRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`),
    fetch(`https://jsonplaceholder.typicode.com/todos?userId=${id}`),
  ]);
  if (!userRes.ok) return null;
  return {
    user: await userRes.json(),
    posts: postsRes.ok ? await postsRes.json() : [],
    todos: todosRes.ok ? await todosRes.json() : [],
  };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await fetchAll(params.id);
  if (!data) return { title: "User not found" };
  return {
    title: `${data.user.name} — User Operations`,
    description: `Profile of ${data.user.name}, ${data.user.company.name}`,
  };
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const data = await fetchAll(params.id);
  if (!data) return notFound();

  const { user, posts, todos } = data;
  const completedTodos = todos.filter((t: any) => t.completed);
  const pendingTodos = todos.filter((t: any) => !t.completed);

  return (
    <div className="detail-root">
      <Link href="/" className="back-link">← Back</Link>

      <div className="detail-grid">
        {/* Left column */}
        <div className="left-col">
          {/* User card */}
          <div className="detail-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h1 className="user-name">{user.name}</h1>
                <p className="user-handle">@{user.username}</p>
              </div>
            </div>

            <div className="info-section">
              <p className="info-label">CONTACT</p>
              <p className="info-row"><span className="info-key">email</span><span className="info-val">{user.email}</span></p>
              <p className="info-row"><span className="info-key">phone</span><span className="info-val">{user.phone}</span></p>
              <p className="info-row"><span className="info-key">web</span>
                <a className="info-link" href={`http://${user.website}`} target="_blank">{user.website}</a>
              </p>
            </div>

            <div className="info-section">
              <p className="info-label">COMPANY</p>
              <p className="info-row"><span className="info-key">name</span><span className="info-val">{user.company.name}</span></p>
              <p className="info-row"><span className="info-key">motto</span><span className="info-val info-muted">"{user.company.catchPhrase}"</span></p>
            </div>

            <div className="info-section">
              <p className="info-label">ADDRESS</p>
              <p className="info-val">{user.address.street}, {user.address.suite}</p>
              <p className="info-val">{user.address.city} {user.address.zipcode}</p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="stat-row">
            {[
              { val: posts.length, label: "Posts", color: "" },
              { val: completedTodos.length, label: "Completed", color: "green" },
              { val: pendingTodos.length, label: "Pending", color: "amber" },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <p className={`stat-number ${s.color ? `stat-${s.color}` : ""}`}>{s.val}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Todos */}
          <div className="todo-wrap">
            <TodoSection title="Pending" todos={pendingTodos} color="#f5a623" />
            <TodoSection title="Completed" todos={completedTodos} color="#4ade80" />
          </div>
        </div>

        {/* Right column — posts */}
        <div className="right-col">
          <p className="section-label">POSTS <span className="section-count">{posts.length}</span></p>
          {posts.length === 0 ? (
            <p className="empty-msg">No posts yet.</p>
          ) : (
            <div className="posts-list">
              {posts.map((post: any) => (
                <div className="post-item" key={post.id}>
                  <span className="post-index">{String(post.id).padStart(2, "0")}</span>
                  <span className="post-title">{post.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}