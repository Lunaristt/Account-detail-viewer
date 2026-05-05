"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export default function Page() {
  const { data, error, isLoading } = useSWR(
    "https://jsonplaceholder.typicode.com/users",
    fetcher,
  );

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    let users = data.filter((user: any) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
    );
    users.sort((a: any, b: any) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return users;
  }, [data, search, sortAsc]);

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users List</h1>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort: {sortAsc ? "A-Z" : "Z-A"}
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table border={1} cellPadding={10} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <a href={`http://${user.website}`} target="_blank">
                    {user.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}