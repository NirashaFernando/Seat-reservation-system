import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import { theme } from "./theme/theme";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
