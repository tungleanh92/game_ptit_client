import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./utils/theme";
import Router from "./pages/Router";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);
