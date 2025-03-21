import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

const AppHeader: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ABC Computer Repair
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to={isDashboard ? "/" : "/dashboard"}
        >
          {isDashboard ? "Chat" : "Dashboard"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router>
      <AppHeader />
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Box display="flex" justifyContent="center">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
