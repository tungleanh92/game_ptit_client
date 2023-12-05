import React, { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #3f51b5;
  border-radius: 3px;
  padding: 0 10px;
  margin-bottom: 10px;
  display: block;
  margin: 20px auto;
`;

const CreateButton = styled.button`
  outline: none;
  background-color: #3f51b5;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 0.5em;
  margin-bottom: 20px;
  cursor: pointer;
  display: block;
  margin: auto;

  &:hover {
    background-color: transparent;
    border: 2px solid #3f51b5;
    color: #3f51b5;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Menu = () => {
  const { handleChangeFaucetClaim, faucetClaimData, faucetClaim } =
    useContext<any>(TransactionContext);
  const [isDisable, setIsDisable] = useState(false);

  return (
    <MainContainer>
      <Box
        sx={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          backgroundColor: "#b8cce3",
          padding: "24px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "#ffffff14 0 4px 16px",
          border: "1px solid #0c141d",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{ textAlign: "center", color: "#3f51b5", marginTop: "10px" }}
        >
          Faucet claim
        </Typography>
        <TextField
          placeholder="Address to claim"
          value={faucetClaimData}
          onChange={handleChangeFaucetClaim}
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "rgb(232, 240, 254)",
              borderRadius: "10px",
              mt: 2,
            },
          }}
        />
        <Button
          // fullWidth
          variant="contained"
          onClick={() => {
            faucetClaim();
          }}
          sx={{
            mt: 3,
          }}
        >
          Faucet claim
        </Button>
      </Box>
    </MainContainer>
    // <div className="d-flex justify-content-center">
    //   <div className="menu">
    //     <div className="text-center game-name">
    //       <h2>Faucet claim</h2>
    //     </div>
    //     <div>
    //         <div className="text-center d-flex flex-column menu-btns">
    //           <Input placeholder="Address to claim" name="addressTo" value={faucetClaimData} type="text" handleChange={handleChangeFaucetClaim} />
    //           <button className="menu-btn mt-2" onClick={faucetClaim}>Faucet claim</button>
    //         </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Menu;
