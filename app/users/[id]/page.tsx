import Link from "next/link";

async function getUser(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

// Bonus: SEO metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return {
    title: `${user.name} — User Details`,
    description: `Profile of ${user.name}, ${user.company.name}`,
  };
}

export default async function UserPage({ params }: { params: { id: string } }) {
  let user;

  try {
    user = await getUser(params.id);
  } catch {
    return <p>Error loading user.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Link href="/">← Back to list</Link>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "24px",
          marginTop: "16px",
        }}
      >
        <h1>{user.name}</h1>
        <p>@{user.username}</p>

        <hr />

        <h2>Contact</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>
          Website:{" "}
          <a href={`http://${user.website}`} target="_blank">
            {user.website}
          </a>
        </p>

        <h2>Company</h2>
        <p>{user.company.name}</p>
        <p>
          <em>"{user.company.catchPhrase}"</em>
        </p>

        <h2>Address</h2>
        <p>
          {user.address.street}, {user.address.suite}
        </p>
        <p>
          {user.address.city}, {user.address.zipcode}
        </p>
      </div>
    </div>
  );
}
