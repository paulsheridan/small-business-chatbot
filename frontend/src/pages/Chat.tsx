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
import axios from "axios";

// Define a type for messages
interface Message {
  role: "user" | "assistant";
  content: string;
}

// Create a Zustand store to hold on to chat messages
interface ChatState {
  messages: Message[];
  addMessage: (msg: Message) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}));

const Chat: React.FC = () => {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Function to handle sending a chat message
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add the user's message to the chat state
    addMessage({ role: "user", content: trimmedInput });
    setInput("");
    setLoading(true);

    try {
      // Call the /chat endpoint on the backend
      const response = await axios.post(`${apiUrl}/chat`, {
        question: trimmedInput,
      });
      const answer = response.data.answer;
      // Add the assistant's answer to the chat state
      addMessage({ role: "assistant", content: answer });
    } catch (error) {
      console.error("Error calling /chat endpoint:", error);
      addMessage({
        role: "assistant",
        content: "Sorry, something went wrong.",
      });
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
            if (e.key === "Enter") {
              handleSend();
            }
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
