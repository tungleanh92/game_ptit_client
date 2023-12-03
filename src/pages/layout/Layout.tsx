import { ReactNode } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Stack from "@mui/material/Stack";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }: { children: ReactNode }) => {
  console.log("123");

  return (
    <Stack direction="column" height="inherit">
      <ToastContainer />
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Stack>
  );
};

export default Layout;
