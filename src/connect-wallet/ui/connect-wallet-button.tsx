import React, { useContext, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button, ButtonProps, useMediaQuery, useTheme } from "@mui/material";
import { useAccount } from "wagmi";
import { formatWalletAddress } from "../util";
import { AppContext } from "../../context/AppContext";
const ConnectWalletButton = (prop: ButtonProps) => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

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
