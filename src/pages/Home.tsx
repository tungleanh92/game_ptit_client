import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { listGame } from "../constants";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TickIcon from "../icons/TickIcon";

const Home = () => {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{
          padding: "50px 0",
        }}
      >
        {listGame.map((item, index) => {
          return (
            <CardGame
              key={index}
              imageUrl={item.imageUrl}
              link={item.link}
              title={item.name}
            />
          );
        })}
      </Stack>
      <Box
        sx={{
          padding: "6rem 0",
        }}
        textAlign="center"
        color="rgb(209, 212, 220)"
      >
        <Typography variant="h3" fontWeight="500">
          A unique gaming platform
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          mt="20px"
        >
          <Typography variant="h5">
            <TickIcon fill="rgb(24, 188, 156)" />
            100% Free
          </Typography>
          <Typography variant="h5">
            <TickIcon fill="rgb(24, 188, 156)" />
            Multiplayer
          </Typography>
          <Typography variant="h5">
            <TickIcon fill="rgb(24, 188, 156)" />
            Kid-friendly
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;

type CardGameProps = {
  imageUrl: string;
  title: string;
  link: string;
};
const CardGame = ({ imageUrl, link, title }: CardGameProps) => {
  return (
    <Link to={link}>
      <Box
        p="10px"
        width="230px"
        textAlign="center"
        sx={{
          transition: "transform .4s",
          borderRadius: "12px",
          backgroundColor: "#2c3e50",
          "&:hover": {
            transform: "scale(1.06)",
          },
        }}
      >
        <img
          src={imageUrl}
          width="100%"
          height="200px"
          style={{
            objectFit: "cover",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
          }}
        />
        <Typography variant="h5" fontWeight="bold" color="white" mt="1rem">
          {title}
        </Typography>
      </Box>
    </Link>
  );
};
