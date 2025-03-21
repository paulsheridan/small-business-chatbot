import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
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
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        width="100vw"
      >
        <AppHeader />
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          p={3}
          width="100%"
        >
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
