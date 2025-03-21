import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../src/pages/Dashboard";
import { rest } from "msw";
import { setupServer } from "msw/node";

const mockMessages = [
  {
    id: 1,
    role: "user",
    content: "Hello?",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: 2,
    role: "assistant",
    content: "Hi there!",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 3,
    role: "user",
    content: "What time do you open?",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
];

const server = setupServer(
  rest.get("http://localhost:5001/messages", (req, res, ctx) => {
    return res(ctx.json(mockMessages));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders message counts and content in Dashboard", async () => {
  render(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByText("Messages in last 5 minutes:")).toBeInTheDocument();
    expect(screen.getByText("Messages in last hour:")).toBeInTheDocument();
    expect(screen.getByText("Messages in last 24 hours:")).toBeInTheDocument();
  });

  expect(await screen.findByText(/Hello\?/)).toBeInTheDocument();
  expect(await screen.findByText(/Hi there!/)).toBeInTheDocument();
  expect(await screen.findByText(/What time do you open/)).toBeInTheDocument();
});
