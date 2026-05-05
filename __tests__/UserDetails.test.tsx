import { render, screen, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { mockUsers, mockPosts, mockTodos } from "./mocks";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

// Helper: resolves the async server component into a renderable element
async function renderUserPage(id: string) {
  const UserPage = (await import("../app/users/[id]/page")).default;
  const jsx = await UserPage({ params: { id } });
  render(jsx as React.ReactElement);
}

function mockUserFetches(userId: number, overridePosts?: any[], overrideTodos?: any[]) {
  const user = mockUsers.find((u) => u.id === userId);
  const posts = overridePosts ?? mockPosts.filter((p) => p.userId === userId);
  const todos = overrideTodos ?? mockTodos.filter((t) => t.userId === userId);

  fetchMock.mockResponse((req) => {
    if (req.url.includes(`/posts`)) return Promise.resolve(JSON.stringify(posts));
    if (req.url.includes(`/todos`)) return Promise.resolve(JSON.stringify(todos));
    if (req.url.includes(`/users/${userId}`)) return Promise.resolve(JSON.stringify(user));
    return Promise.resolve(JSON.stringify({}));
  });
}

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_NOT_FOUND"); },
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("User Details", () => {
  test("renders user details correctly", async () => {
    mockUserFetches(1);
    await renderUserPage("1");

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("@Bret")).toBeInTheDocument();
    expect(screen.getByText(/Sincere@april.biz/)).toBeInTheDocument();
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
    expect(screen.getByText(/Gwenborough/)).toBeInTheDocument();
  });

  test("renders posts section", async () => {
    mockUserFetches(1);
    await renderUserPage("1");

    expect(screen.getByText("Posts (2)")).toBeInTheDocument();
    expect(screen.getByText("Post one")).toBeInTheDocument();
    expect(screen.getByText("Post two")).toBeInTheDocument();
  });

  test("renders todo counts", async () => {
  mockUserFetches(1);
  await renderUserPage("1");

  expect(screen.getByText("1")).toBeInTheDocument(); // 1 completed
  const twos = screen.getAllByText("2");
  expect(twos.length).toBeGreaterThan(0); // 2 posts + 2 pending both show "2"
});

  test("shows no posts message when user has no posts", async () => {
    mockUserFetches(1, [], []);
    await renderUserPage("1");

    expect(screen.getByText("No posts yet.")).toBeInTheDocument();
  });

  test("handles invalid user id with notFound", async () => {
    fetchMock.mockResponse(() =>
      Promise.resolve({ status: 404, body: "Not found" })
    );

    await expect(renderUserPage("999")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  test("handles fetch error gracefully", async () => {
    fetchMock.mockReject(new Error("Network error"));
    await expect(renderUserPage("1")).rejects.toThrow();
  });
});