

import React from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button, ButtonProps, useMediaQuery, useTheme } from "@mui/material";
import { useAccount } from "wagmi";
import { formatWalletAddress } from "../util";
// import { formatWalletAddress } from "@/utils/util";
// import useScreen from "@/hooks/useScreen";
const ConnectWalletButton = (prop: ButtonProps) => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  // const theme = useTheme()
  // const matches = useMediaQuery(theme.breakpoints.down('md'))
  // const { isDownMd } = useScreen();

  const onConnect = () => {
    console.log("Connecting");
    if (!!address) {
      open({
        view: "Account",
      });
    } else {
      open({
        view: "Connect",
      });
    }
  };
  return (
    <Button
      variant="contained"
      sx={{
        padding: "12px",
        borderRadius: "8px",
        // fontSize: isDownMd ? "13px" : "normal",
      }}
      onClick={onConnect}
    >
      {address ? formatWalletAddress(address) : "Connect Wallet"}
    </Button>
    // <w3m-button />
  );
};

export default ConnectWalletButton;
