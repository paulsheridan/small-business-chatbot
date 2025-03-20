import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";

import Chat from "./pages/Chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/`).then((res) => setMessage(res.data.message));
  }, []);

  return (
    <Container>
      <Typography variant="h4">Chatbot App</Typography>
      <Typography variant="body1">{message}</Typography>
      <Chat />
    </Container>
  );
}

export default App;
