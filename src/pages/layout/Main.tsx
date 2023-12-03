import Box from "@mui/material/Box";
import { ReactNode } from "react";

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <Box
    flex={1}
      sx={{
        // #101B27
        backgroundColor: "#1B2837",
      }}
    >
      {children}
    </Box>
  );
};

export default Main;
