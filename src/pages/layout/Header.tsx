import React, { useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useToggle } from "../../hooks/useToggle";
import Popover from "@mui/material/Popover";
import DepositWithdraw from "../modal/DepositWithdraw";
import { useCopy } from "../../hooks/useCopy";
import PlayGameIcon from "../../icons/PlayGameIcon";
import ConnectWalletButton from "../../connect-wallet/ui/connect-wallet-button";

const Header = () => {
  const { wallet } = useContext(AppContext);
  const [isModalOpen, setOpenModal] = useToggle(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { isCopied, copy } = useCopy(wallet?.address || "");

  const handleClose = () => {
    setAnchorEl(null);
    setOpenModal(false);
  };

  console.log("triggle_2");
  console.log(wallet);

  return (
    <Box
      width="100%"
      sx={{
        backgroundColor: "#233448",
        color: "#d1d4dc",
        p: "16px",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <NavLink to="/">
              <PlayGameIcon
                sx={{
                  height: "2rem",
                  width: "2rem",
                }}
              />
            </NavLink>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                "& a": {
                  p: "10px 12px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#1B2837",
                  },
                },
              }}
            >
              <NavLink to="/caro">Caro</NavLink>
              <NavLink to="/chess">Chess</NavLink>
              <NavLink to="/faucet-claim">Faucet</NavLink>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <DepositWithdraw />
            <ConnectWalletButton />
            <Popover
              open={isModalOpen}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: "3px",
                    maxWidth: "250px",
                    width: "100%",
                    backgroundColor: "transparent",
                  },
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#233448",
                }}
              >
                <Box
                  color="#d1d4dc"
                  sx={{
                    padding: "12px",
                  }}
                >
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography
                      flex={1}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                      onClick={copy}
                    >
                      Address: {isCopied ? "Copied" : wallet?.address || null}
                    </Typography>
                  </Box>
                  <Typography>Balance: {wallet?.balances || 0}</Typography>
                </Box>
              </Box>
            </Popover>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
