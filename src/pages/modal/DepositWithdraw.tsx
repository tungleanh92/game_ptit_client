import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useToggle } from "../../hooks/useToggle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useContext, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import { AppContext } from "../../context/AppContext";

type DepositWithdrawProps = {};
const DepositWithdraw = ({}: DepositWithdrawProps) => {
  const { connectWallet, wallet } = useContext(AppContext);
  const [open, setOpen] = useToggle(false);
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [amountDeposit, setAmountDeposit] = useState("");
  const [amountWithdraw, setAmountWithdraw] = useState("");

  const handleValidateNumber = (
    value: any,
    callback: (data: string) => void
  ) => {
    const re = new RegExp(/[0-9]+$/);

    const valid = re.test(value);
    if (valid || value == "") {
      callback(value);
    }
  };

  useEffect(() => {
    reset();
  }, [tab]);

  const reset = () => {
    setAmountDeposit("");
    setAmountWithdraw("");
  };
  return (
    <>
      <Typography
        onClick={setOpen}
        sx={{
          padding: "12px",
          cursor: "pointer",
          color: "#1976d2",
        }}
      >
        Deposit / Withdraw
      </Typography>
      <Modal
        open={open}
        onClose={setOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            maxWidth: "600px",
            backgroundColor: "#233448",
            border: "1px solid white",
            padding: "50px",
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#d1d4dc",
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, value) => setTab(value)}
            aria-label="wrapped label tabs example"
          >
            <Tab
              value="deposit"
              label="Deposit"
              sx={{
                textTransform: "initial",
                color: "#d1d4dc",
                flex: 1,
              }}
            />
            <Tab
              value="withdraw"
              label="Withdraw"
              sx={{
                textTransform: "initial",
                color: "#d1d4dc",
                flex: 1,
              }}
            />
          </Tabs>
          <Box mt={3}>
            {tab === "deposit" && (
              <Stack direction="column" spacing={2}>
                <InputLabel sx={{ color: "#d1d4dc" }}>Amount1</InputLabel>
                <InputBase
                  fullWidth
                  required
                  type="number"
                  id="1"
                  value={amountDeposit || ""}
                  onChange={(e) =>
                    handleValidateNumber(e.target.value, setAmountDeposit)
                  }
                  sx={{
                    fontSize: "16px",
                    "& .MuiInputBase-input": {
                      padding: "10px",
                      backgroundColor: "rgb(232, 240, 254)",
                      borderRadius: "3px",
                    },
                  }}
                />
                <Typography>Balance: {wallet?.balances || 0}</Typography>
                <Button disableElevation variant="contained">
                  Deposit
                </Button>
              </Stack>
            )}
            {tab === "withdraw" && (
              <Stack direction="column" spacing={2}>
                <InputLabel sx={{ color: "#d1d4dc" }}>Amount2</InputLabel>
                <InputBase
                  fullWidth
                  required
                  type="number"
                  id="2"
                  value={amountWithdraw || ""}
                  onChange={(e) =>
                    handleValidateNumber(e.target.value, setAmountWithdraw)
                  }
                  sx={{
                    fontSize: "16px",
                    "& .MuiInputBase-input": {
                      padding: "10px",
                      backgroundColor: "rgb(232, 240, 254)",
                      borderRadius: "3px",
                    },
                  }}
                />
                <Typography>Balance: {wallet?.balances || 0}</Typography>
                <Button disableElevation variant="contained">
                  Withdraw
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DepositWithdraw;
