import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Footer = () => {
  return (
    <Box
      p="1.5rem"
      color="#d1d4dc"
      textAlign="center"
      sx={{
        backgroundColor: "#101b27f5",
      }}
    >
      © 2023 Copyright:{" "}
      <Link
        component="a"
        href="#"
        sx={{
          outline: "none",
          textDecoration: "none",
        }}
      >
        Igame.io
      </Link>
    </Box>
  );
};

export default Footer;
