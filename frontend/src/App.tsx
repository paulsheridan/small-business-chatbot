import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/`).then((res) => setMessage(res.data.message));
  }, []);
  return (
    <Router>
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Typography variant="h4">Chatbot App</Typography>
        <Typography variant="body1">{message}</Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          style={{ marginRight: "1rem" }}
        >
          Chat
        </Button>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="secondary"
        >
          Dashboard
        </Button>

        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
