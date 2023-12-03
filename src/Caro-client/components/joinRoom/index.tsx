import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../../../context/gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import { TransactionContext } from "../../../context/TransactionContext-caro";
import * as urlAPI from "../../../utils/url";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IJoinRoomProps {}

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
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
`;

const RoomIdSelect = styled.select`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
`;

const CreateButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
  margin-top: -10px;
  margin-left: 110px;
  margin-bottom: 30px;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
  margin-top: 100px;
`;

export function JoinRoom(props: IJoinRoomProps) {
  const [isJoining, setJoining] = useState(false);

  const { setInRoom, isInRoom } = useContext(gameContext);

  const {
    connectWallet,
    wallet,
    joinGame,
    winnerClaim,
    updateBalance,
    handleChangeDeposit,
    handleChangeWithdraw,
    handleChangeFaucetClaim,
    handleChangeJoinGame,
    handleChangeGameId,
    depositData,
    withdrawData,
    faucetClaimData,
    joinGameData,
    gameIdName,
    depositToken,
    withdrawToken,
    faucetClaim,
  } = useContext(TransactionContext);

  const [rooms, setRooms] = useState([]);
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    socketService.connect(`http://${urlAPI.url}${urlAPI.port}`);
    const socket = socketService.socket;
    if (!socket) return;
    socket.emit("update_waiting_games");
    socket.on("list_room", ({ rooms }: any) => {
      setRooms(rooms);
    });
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("update_waiting_games");
    socket.on("list_room", ({ rooms }: any) => {
      setRooms(rooms);
    });
  }, [rooms]);

  const joinRoom = async (
    e: React.FormEvent,
    message: string,
    roomId: string,
    amount: string
  ) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!socket) return;
    await joinGame(amount, roomId);
    setJoining(true);
    const data = [];
    data.push(gameIdName);
    data.push(joinGameData.toString());
    data.push("caro");
    let data_string = data.join("_");
    if (message) {
      data_string = message;
    }
    console.log(data_string, "data_string");

    const joined = await gameService
      .joinGameRoom(socket, data_string)
      .catch((err) => {
        alert(err);
      });

    if (joined) setInRoom(true);

    setJoining(false);
  };

  const RenderWaitingRooms = rooms.map((room: string, index: any) => {
    const [roomId, amount, type] = room.split("_");
    if (type == "caro") {
      return (
        <div key={index} className="card">
          <p style={{ color: "#8e44ad" }}>Room name: {roomId}</p>
          <p style={{ color: "#8e44ad" }}>Amount: {amount}</p>
          <JoinButton
            className="menu-btn mt-2"
            onClick={(e) => joinRoom(e, room, roomId, amount)}
          >
            Join Game
          </JoinButton>
        </div>
      );
    }
  });

  return (
    <>
      {/* <JoinRoomContainer>
        <p style={{color: "#8e44ad"}}>Waiting Games:</p>
        <Wrapper>
          {RenderWaitingRooms}
        </Wrapper>
      </JoinRoomContainer> */}

      {/* <JoinRoomContainer>
        <WelcomeText>Welcome to Tic-Tac-Toe</WelcomeText>
        {!wallet.address ? (
          <CreateButton className="menu-btn mt-2" onClick={connectWallet}>
            Connect wallet
          </CreateButton>
        ) : (
          <>
            <div style={{ fontSize: "30px", color: "#8e44ad" }}>
              {wallet.address}
            </div>
            <div style={{ fontSize: "30px", color: "#8e44ad" }}>
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
        <h4 style={{ color: "#8e44ad" }}>Enter Room ID to create the Game</h4>
        <RoomIdInput
          placeholder="Room ID"
          value={gameIdName}
          onChange={handleChangeGameId}
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
          className="menu-btn mt-2"
          onClick={(e) => joinRoom(e, "", "", "")}
        >
          Create game
        </CreateButton>
      </JoinRoomContainer> */}

      <Box
        sx={{
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
          Welcome to Caro
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
            src="/images/connect4.png"
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
              value={gameIdName}
              onChange={handleChangeGameId}
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
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={300}>300</MenuItem>
            </TextField>
            <Button variant="contained" fullWidth>
              Create game
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
