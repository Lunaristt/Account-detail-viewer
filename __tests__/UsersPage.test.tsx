import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import { mockUsers, mockPosts, mockTodos } from "./mocks";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Control what useSWR returns across tests
let swrState: Record<string, any> = {};

jest.mock("swr", () => ({
  __esModule: true,
  default: (key: string) => swrState[key] ?? { data: undefined, error: undefined, isLoading: true },
  SWRConfig: ({ children }: any) => children,
}));

beforeEach(() => {
  fetchMock.resetMocks();
  // Default: loading state
  swrState = {};
});

function setSwrSuccess() {
  swrState = {
    "https://jsonplaceholder.typicode.com/users": { data: mockUsers, error: undefined, isLoading: false },
    "https://jsonplaceholder.typicode.com/posts": { data: mockPosts, error: undefined, isLoading: false },
    "https://jsonplaceholder.typicode.com/todos": { data: mockTodos, error: undefined, isLoading: false },
  };
}

function setSwrError() {
  swrState = {
    "https://jsonplaceholder.typicode.com/users": { data: undefined, error: new Error("fail"), isLoading: false },
    "https://jsonplaceholder.typicode.com/posts": { data: undefined, error: new Error("fail"), isLoading: false },
    "https://jsonplaceholder.typicode.com/todos": { data: undefined, error: new Error("fail"), isLoading: false },
  };
}

function renderPage() {
  const Page = require("../app/page").default;
  return render(<Page />);
}

describe("Users List", () => {
  test("shows loading state initially", () => {
    renderPage();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows error state when fetch fails", () => {
    setSwrError();
    renderPage();
    expect(screen.getByText("Error loading data.")).toBeInTheDocument();
  });

  test("renders users with activity signals", () => {
    setSwrSuccess();
    renderPage();

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.getByText(/2 posts/)).toBeInTheDocument();
    expect(screen.getByText(/1 posts/)).toBeInTheDocument();
  });

  test("filters users by search", async () => {
    setSwrSuccess();
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Search by name or email..."), "Ervin");

    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  });

  test("filters users with no completed todos", async () => {
    setSwrSuccess();
    renderPage();

    await userEvent.selectOptions(
      screen.getByDisplayValue("All users"),
      "no-completed"
    );

    expect(screen.getByText("No users match your filter.")).toBeInTheDocument();
  });

  test("sorts users by most pending todos", async () => {
    setSwrSuccess();
    renderPage();

    await userEvent.selectOptions(
      screen.getByDisplayValue("Name A-Z"),
      "most-pending"
    );

    const cards = screen.getAllByText(/pending/);
    expect(cards[0]).toBeInTheDocument();
  });

  test("shows empty state when no users match filter", async () => {
    setSwrSuccess();
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Search by name or email..."), "zzznomatch");

    expect(screen.getByText("No users match your filter.")).toBeInTheDocument();
  });
});