import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useToggle } from "../../hooks/useToggle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import { AppContext } from "../../context/AppContext";
import LoadingIcon from "../../icons/LoadingIcon";

type DepositWithdrawProps = {};
const DepositWithdraw = ({}: DepositWithdrawProps) => {
  const {
    balanceToken,
    wallet,
    depositData,
    withdrawData,
    handleChangeDeposit,
    handleChangeWithdraw,
    withdrawToken,
    depositToken,
    isLoading,
    balanceApprove,
    approveBalance,
  } = useContext(AppContext);

  const [open, setOpen] = useToggle(false);
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");

  const styleActionBtn = useMemo(() => {
    let nameBtn = "";
    let action: Function;
    let isDisabled = isLoading;
    const amount = tab === "deposit" ? depositData : withdrawData;

    if (parseFloat(amount) > parseFloat(balanceApprove) && tab === "deposit") {
      return { action: approveBalance, nameBtn: "Approve" };
    }

    if (tab === "deposit") {
      nameBtn = isDisabled ? "Deposit..." : "Deposit";
      action = depositToken;
    } else {
      nameBtn = isDisabled ? "Withdraw..." : "Withdraw";
      action = withdrawToken;
    }

    return {
      nameBtn,
      action,
      isDisabled,
    };
  }, [balanceApprove, depositToken, withdrawToken, approveBalance, tab]);

  const handleValidateNumber = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    callback: (data: string) => void
  ) => {
    const value = e.target.value;
    const re = new RegExp(/[0-9]+$/);

    const valid = re.test(value);
    if (valid || value == "") {
      callback(value);
    }
  };

  const reset = () => {
    handleChangeDeposit("");
    handleChangeWithdraw("");
  };

  useEffect(() => {
    reset();
  }, [tab]);

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
          <form onSubmit={styleActionBtn.action}>
            <Box mt={3}>
              <Stack direction="column" spacing={2}>
                <InputLabel sx={{ color: "#d1d4dc" }}>Amount</InputLabel>
                {tab === "deposit" ? (
                  <InputBase
                    fullWidth
                    required
                    type="number"
                    id="1"
                    value={depositData || ""}
                    onChange={(e) =>
                      handleValidateNumber(e, handleChangeDeposit)
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
                ) : null}
                {tab === "withdraw" ? (
                  <InputBase
                    fullWidth
                    required
                    type="number"
                    id="2"
                    value={withdrawData || ""}
                    onChange={(e) =>
                      handleValidateNumber(e, handleChangeWithdraw)
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
                ) : null}
                <Box>
                  <Typography>
                    Available in game: {wallet?.balances || 0}
                  </Typography>
                  <Typography>In wallet: {balanceToken || 0}</Typography>
                </Box>
                <Button
                  disableElevation
                  type="submit"
                  variant="contained"
                  disabled={styleActionBtn.isDisabled}
                  sx={{
                    "&.Mui-disabled": {
                      color: "#fff9f938",
                    },
                  }}
                >
                  {styleActionBtn.isDisabled ? (
                    <LoadingIcon
                      sx={{
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                      mr={1}
                    />
                  ) : null}
                  {styleActionBtn.nameBtn}
                </Button>
              </Stack>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default DepositWithdraw;
