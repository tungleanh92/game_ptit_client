import React from "react";
import { useContext, useState, useEffect } from "react";
import { Datacontext } from "../../context/Datacontext";
import { Redirect } from "react-router-dom";
import "./Join.css";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const Wrapper = styled.div`
  overflow: auto;
  height: 450px;
  width: 250px;
`;

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #3f51b5;
  border-radius: 3px;
  padding: 0 10px;
  margin-bottom: 10px;
`;

const RoomIdSelect = styled.select`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #3f51b5;
  border-radius: 3px;
  padding: 0 10px;
  margin-bottom: 10px;
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

  &:hover {
    background-color: transparent;
    border: 2px solid #3f51b5;
    color: #3f51b5;
  }
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #3f51b5;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid #3f51b5;
    color: #3f51b5;
  }
  margin-top: -10px;
  margin-left: 110px;
  margin-bottom: 30px;
`;

export const Join = () => {
  const {
    redirect,
    gameId,
    Setusername,
    username,
    generateGameId,
    socket,
    connectWallet,
    wallet,
    handleChangeDeposit,
    handleChangeWithdraw,
    handleChangeFaucetClaim,
    handleChangeJoinGame,
    handleChangeGameIdName,
    depositData,
    withdrawData,
    faucetClaimData,
    joinGameData,
    gameIdName,
    depositToken,
    withdrawToken,
    faucetClaim,
    setJoinGameBtn,
  } = useContext<any>(Datacontext);
  const [rooms, setRooms] = useState<any>([]);

  console.log('triggle');
  
  useEffect(() => {
    if (!socket) return;
    socket.emit("updateWaitingGames_chess");
    socket.on("waitingGames_chess", ({ rooms }: any) => {
      setRooms(rooms);
    });
  }, [rooms]);

  const joinRoom = async (e: any, roomId: any, amount: any) => {
    e.preventDefault();
    if (!socket) return;
    if (!username) {
      toast("Username required!");
    }
    setJoinGameBtn(true);
    generateGameId(roomId, amount);
  };

  const RenderWaitingRooms = rooms.map((room: any) => {
    if (room) {
      // eslint-disable-next-line prefer-const
      let [roomId, amount, type] = room.split("_");
      if (type == "chess") {
        return (
          <div className="card">
            <p style={{ color: "#3f51b5" }}>Room name: {roomId}</p>
            <p style={{ color: "#3f51b5" }}>Amount: {amount}</p>
            <JoinButton
              className="menu-btn mt-2"
              onClick={(e) => joinRoom(e, roomId, amount)}
            >
              Join Game
            </JoinButton>
          </div>
        );
      }
    }
  });

  //Refactor
  const handleCreateGame = () => {
    if (username === "") {
      toast.error("Nickname required");
      return;
    }
    generateGameId();
  };

  return (
    <>
      {redirect ? (
        <Redirect to={"/chess/game/" + gameId} />
      ) : (
        <>
          {/* <MainContainer>
            <ToastContainer />
            <JoinRoomContainer>
              <p style={{ color: "#3f51b5", marginTop: "150px" }}>
                Waiting Games:
              </p>
              <Wrapper>{RenderWaitingRooms}</Wrapper>
            </JoinRoomContainer>
            <div className="home-container">
              <h1
                style={{
                  color: "#3f51b5",
                  marginTop: "150px",
                  marginBottom: "60px",
                }}
              >
                Welcome to chess
              </h1>
              {!wallet.address ? (
                <CreateButton className="menu-btn mt-2" onClick={connectWallet}>
                  Connect wallet
                </CreateButton>
              ) : (
                <>
                  <div style={{ fontSize: "30px", color: "#3f51b5" }}>
                    {wallet.address}
                  </div>
                  <div style={{ fontSize: "30px", color: "#3f51b5" }}>
                    {wallet.balances}
                  </div>
                </>
              )}
              <RoomIdInput
                placeholder="Amount (ETH) to deposit"
                value={depositData}
                onChange={handleChangeDeposit}
                type="number"
                step="0.0001"
              />
              <CreateButton className="menu-btn mt-2" onClick={depositToken}>
                Deposit token
              </CreateButton>
              <RoomIdInput
                placeholder="Amount (ETH) to withdraw"
                value={withdrawData}
                onChange={handleChangeWithdraw}
                type="number"
                step="0.0001"
              />
              <CreateButton className="menu-btn mt-2" onClick={withdrawToken}>
                Withdraw token
              </CreateButton>
              <h4 style={{ color: "#3f51b5" }}>
                Enter your nickname to create game
              </h4>
              <RoomIdInput
                id="outlined-basic"
                placeholder="Nickname"
                required
                onChange={(event) => Setusername(event.target.value)}
              />
              <RoomIdSelect
                placeholder="Amount (ETH) to play game"
                value={joinGameData}
                onChange={handleChangeJoinGame}
              >
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
              </RoomIdSelect>
              <CreateButton
                color="primary"
                onClick={(event) =>
                  username === ""
                    ? toast("Username required")
                    : generateGameId()
                }
              >
                Create game
              </CreateButton>
            </div>
          </MainContainer> */}

          <Box
            sx={{
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",

              backgroundColor: "#0c141d",
              padding: "24px",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "#ffffff14 0 4px 16px",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{
                color: "white",
              }}
            >
              Welcome to Chess
            </Typography>
            <Box
              mt={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <img
                src="/images/chess.png"
                width="200px"
                height="200px"
                style={{
                  height: "100%",
                  objectFit: "contain",
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                }}
              />
              <Box
                flex={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  sx={{
                    color: "white",
                  }}
                >
                  Waiting Games:
                </InputLabel>
                <TextField
                  placeholder="Nickname"
                  fullWidth
                  value={username}
                  onChange={(event) => Setusername(event.target.value)}
                  sx={{
                    fontSize: "16px",
                    "& .MuiInputBase-input": {
                      padding: "10px",
                      backgroundColor: "rgb(232, 240, 254)",
                      borderRadius: "3px",
                    },
                  }}
                />
                <TextField
                  select
                  fullWidth
                  value={joinGameData}
                  onChange={handleChangeJoinGame}
                  sx={{
                    fontSize: "16px",
                    "& .MuiInputBase-input": {
                      padding: "10px",
                      backgroundColor: "rgb(232, 240, 254)",
                      borderRadius: "3px",
                    },
                  }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCreateGame}
                >
                  Create game
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
