import request from "supertest";
import express from "express";
import server from "../src/server";
import { createServer } from "http";

jest.mock("openai", () => {
  const mockStream = async function* () {
    yield { choices: [{ delta: { content: "Hello" } }] };
    yield { choices: [{ delta: { content: " from" } }] };
    yield { choices: [{ delta: { content: " chatbot." } }] };
  };

  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(() => mockStream()),
        },
      },
    })),
  };
});

describe("/chat endpoint", () => {
  it("should return 400 if question is missing", async () => {
    const res = await request(server).post("/chat").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing question parameter.");
  });

  it("should stream a chatbot response", async () => {
    const response = await request(server)
      .post("/chat")
      .send({ question: "What's up?" });

    expect(response.status).toBe(200);
    expect(response.text).toContain("Hello from chatbot.");
  });
});

describe("/messages endpoint", () => {
  it("should return an array of messages", async () => {
    const res = await request(server).get("/messages");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
