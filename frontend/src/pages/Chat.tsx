import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { create } from "zustand";

// Define a type for messages
interface Message {
  role: "user" | "assistant";
  content: string;
}

// Create a Zustand store to manage chat messages
interface ChatState {
  messages: Message[];
  addMessage: (msg: Message) => void;
}

// The frontend uses its own storage medium for past messages, even though
// the backend logs all messages sent.
const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}));

const Chat: React.FC = () => {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Handle streaming chat response
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    addMessage({ role: "user", content: trimmedInput });
    setInput("");
    setLoading(true);

    // Add an empty assistant message to be updated in real-time
    let newAssistantMessage = { role: "assistant", content: "" };
    addMessage(newAssistantMessage);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Append the new text to the last assistant message
        newAssistantMessage = {
          ...newAssistantMessage,
          content: newAssistantMessage.content + chunk,
        };

        // Update our Zustand state
        useChatStore.setState((state) => ({
          messages: state.messages.map((msg, index) =>
            index === state.messages.length - 1 ? newAssistantMessage : msg
          ),
        }));
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      newAssistantMessage.content = "Sorry, something went wrong.";
      // Finally will ensure that setLoading is changed to False no matter what.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Chatbot
      </Typography>
      <Paper
        elevation={3}
        style={{
          padding: "1rem",
          minHeight: "300px",
          marginBottom: "1rem",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            mb={2}
            textAlign={msg.role === "user" ? "right" : "left"}
          >
            <Typography
              variant="body1"
              style={{
                background: msg.role === "user" ? "#cfe9ff" : "#e8e8e8",
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
        {loading && (
          <Typography variant="body2" color="textSecondary">
            Loading...
          </Typography>
        )}
      </Paper>
      <Box display="flex">
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={loading}
          style={{ marginLeft: "0.5rem" }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;
