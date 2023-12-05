import { ReactNode } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Stack from "@mui/material/Stack";
import { ToastContainer } from "react-toastify";
import WagmiProvider from "../../connect-wallet/provider";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack direction="column" height="inherit">
      <ToastContainer />
      <WagmiProvider>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </WagmiProvider>
    </Stack>
  );
};

export default Layout;
