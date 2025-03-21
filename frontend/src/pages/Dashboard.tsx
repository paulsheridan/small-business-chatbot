import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiUrl}/messages`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [apiUrl]);

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Chatbot Conversation History
      </Typography>
      {loading && <Typography>Loading messages...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Paper
        elevation={3}
        style={{ padding: "1rem", maxHeight: "500px", overflowY: "auto" }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
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
              <strong>{msg.role === "user" ? "User" : "Assistant"}:</strong>{" "}
              {msg.content}
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block">
              {new Date(msg.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default Dashboard;
