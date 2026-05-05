import Link from "next/link";
import { notFound } from "next/navigation";
import TodoSection from "./TodoSection";

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
    title: `${data.user.name} — User Details`,
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
    <div style={{ padding: "20px" }}>
      <Link href="/">← Back to list</Link>

      <div className="main-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginTop: "16px",
        alignItems: "start",
      }}>

        {/* Left column: user card + 3 stat cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Big user card */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "24px" }}>
            <h1 style={{ margin: "0 0 4px" }}>{user.name}</h1>
            <p style={{ margin: "0 0 20px", color: "#666" }}>@{user.username}</p>

            <h3 style={{ margin: "0 0 8px" }}>Contact</h3>
            <p style={{ margin: "4px 0" }}>📧 {user.email}</p>
            <p style={{ margin: "4px 0" }}>📞 {user.phone}</p>
            <p style={{ margin: "4px 0" }}>
              🌐 <a href={`http://${user.website}`} target="_blank">{user.website}</a>
            </p>

            <h3 style={{ margin: "20px 0 8px" }}>Company</h3>
            <p style={{ margin: "4px 0", fontWeight: "bold" }}>{user.company.name}</p>
            <p style={{ margin: "4px 0", color: "#666", fontStyle: "italic" }}>"{user.company.catchPhrase}"</p>

            <h3 style={{ margin: "20px 0 8px" }}>Address</h3>
            <p style={{ margin: "4px 0" }}>
              {user.address.street}, {user.address.suite}, {user.address.city} {user.address.zipcode}
            </p>
          </div>

          {/* 3 stat cards in a row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>{posts.length}</p>
              <p style={{ margin: "6px 0 0", color: "#666", fontSize: "13px" }}>Total Posts</p>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "green" }}>{completedTodos.length}</p>
              <p style={{ margin: "6px 0 0", color: "#666", fontSize: "13px" }}>Completed</p>
              <div style={{ marginTop: "12px" }}>
                <TodoSection title="View all" todos={completedTodos} color="green" />
              </div>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "orange" }}>{pendingTodos.length}</p>
              <p style={{ margin: "6px 0 0", color: "#666", fontSize: "13px" }}>Pending</p>
              <div style={{ marginTop: "12px" }}>
                <TodoSection title="View all" todos={pendingTodos} color="orange" />
              </div>
            </div>
          </div>

        </div>

        {/* Right column: posts list */}
        <div>
          <h2 style={{ margin: "0 0 12px" }}>Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p style={{ color: "#888" }}>No posts yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {posts.map((post: any) => (
                <div key={post.id} style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14px",
                }}>
                  {post.title}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}