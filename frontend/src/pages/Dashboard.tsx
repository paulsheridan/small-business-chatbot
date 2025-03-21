// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Divider,
} from "@mui/material";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiUrl}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [apiUrl]);

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const messagesInLast = (since: Date) =>
    messages.filter((msg) => new Date(msg.timestamp) > since).length;

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Chatbot Conversation History
      </Typography>

      <Paper elevation={3} style={{ padding: "1rem", marginBottom: "1.5rem" }}>
        <Typography variant="h6">Message Activity</Typography>
        <Divider style={{ margin: "0.5rem 0 1rem" }} />
        <Typography variant="body1">
          Messages in last 5 minutes:{" "}
          <strong>{messagesInLast(fiveMinutesAgo)}</strong>
        </Typography>
        <Typography variant="body1">
          Messages in last hour: <strong>{messagesInLast(oneHourAgo)}</strong>
        </Typography>
        <Typography variant="body1">
          Messages in last 24 hours:{" "}
          <strong>{messagesInLast(oneDayAgo)}</strong>
        </Typography>
      </Paper>

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
