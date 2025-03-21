import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../src/pages/Chat";
import { rest } from "msw";
import { setupServer } from "msw/node";

const mockServer = setupServer(
  rest.post("http://localhost:5001/chat", (req, res, ctx) => {
    return res(ctx.body("Hello from chatbot."));
  })
);

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test("sends user message and receives assistant response", async () => {
  render(<Chat />);
  const input = screen.getByPlaceholderText("Ask a question...");
  fireEvent.change(input, { target: { value: "Hello" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  await waitFor(() => {
    expect(screen.getByText(/Hello from chatbot/i)).toBeInTheDocument();
  });
});
