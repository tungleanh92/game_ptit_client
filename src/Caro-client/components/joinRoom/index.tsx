import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../../../context/gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import { TransactionContext } from "../../../context/TransactionContext-caro";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import LoadingIcon from "../../../icons/LoadingIcon";
import { AppContext } from "../../../context/AppContext";

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
  max-height: 450px;
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
  width: fit-content;
  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

const baseUrl = process.env.REACT_APP_BASE_URL;
const socketUrl = process.env.REACT_APP_WEBSOCKET;

export function JoinRoom(props: IJoinRoomProps) {
  const [isJoining, setJoining] = useState(false);

  const { setInRoom, isInRoom } = useContext(gameContext);

  const {
    joinGame,
    handleChangeJoinGame,
    handleChangeGameId,
    joinGameData,
    gameIdName,
    isLoading,
  } = useContext(TransactionContext);
  const { updateAccount } = useContext(AppContext);

  const [rooms, setRooms] = useState([]);
  const [socket, setSocket] = useState<any>();
  const [isLoadingRoom, setLoadingRoom] = useState(false);
  const [isJoinRoom, setJoinRoom] = useState(false);

  useEffect(() => {
    socketService.connect(socketUrl || "");
    const socket = socketService.socket;
    if (!socket) return;
    setSocket(socket);
    socket.emit("leave_room");
    socket.emit("update_waiting_games");
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("update_waiting_games");
    socket.on("list_room", ({ rooms }: any) => {
      setRooms(rooms);
    });

    const timer = setInterval(() => {
      socket.emit("update_waiting_games");
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [socket]);

  const { setGameStarted } = useContext(gameContext);

  useEffect(() => {
    setGameStarted(false);
  }, []);

  const joinRoom = async (
    e: React.FormEvent,
    message: string,
    roomId: string,
    amount: string,
    callback?: (status: boolean) => void
  ) => {
    e.preventDefault();
    try {
      callback?.(true);
      const socket = socketService.socket;
      if (!socket) return;
      const { nextGameId } = await joinGame(amount, roomId);

      const data = [];
      data.push(gameIdName);
      data.push(nextGameId);
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

      console.log(joined);

      if (joined) setInRoom(true);
      callback?.(false);
      updateAccount();
    } catch (error) {
      console.log(error);
      callback?.(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0c141d",
        padding: "24px",
        maxWidth: "650px",
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
          component="form"
          flex={1}
          onSubmit={(e) => joinRoom(e, "", "", "", setLoadingRoom)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TextField
            placeholder="Room name"
            fullWidth
            required
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
            required
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
            <MenuItem value={0.1}>0.1</MenuItem>
            <MenuItem value={0.2}>0.2</MenuItem>
            <MenuItem value={0.3}>0.3</MenuItem>
          </TextField>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={isLoadingRoom}
            sx={{
              "&.Mui-disabled": {
                color: "#fff9f947",
                backgroundColor: "currentColor",
              },
            }}
          >
            {isLoadingRoom ? (
              <>
                <LoadingIcon
                  sx={{
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                  mr={1}
                />
                Create game...
              </>
            ) : (
              "Create game"
            )}
          </Button>
        </Box>
      </Box>
      <JoinRoomContainer>
        {rooms.length > 0 ? (
          <>
            <p style={{ color: "#8e44ad" }}>Waiting Rooms:</p>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              width="100%"
              flexWrap="wrap"
              gap="4px"
              mt={2}
            >
              {rooms.map((room: string, index: any) => {
                const [roomIdName, roomId, amount, type] = room.split("_");
                return type == "caro" ? (
                  <Stack
                    key={index}
                    direction="column"
                    p={1}
                    maxWidth="200px"
                    sx={{
                      border: "1px solid #d1d4dc38",
                      borderRadius: "10px",
                    }}
                  >
                    <p style={{ color: "#8e44ad" }}>Room name: {roomIdName}</p>
                    <p style={{ color: "#8e44ad" }}>Amount: {amount}</p>
                    <JoinButton
                      className="menu-btn mt-4"
                      style={{
                        marginTop: "1rem",
                        ...(isJoinRoom
                          ? {
                              color: "#fff9f947",
                              backgroundColor: "currentColor",
                              border: "2px solid transparent",
                            }
                          : {}),
                      }}
                      onClick={(e) =>
                        joinRoom(e, room, roomId, amount, setJoinRoom)
                      }
                      disabled={isJoinRoom}
                    >
                      {isJoinRoom ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <LoadingIcon
                            sx={{
                              width: "1rem",
                              height: "1rem",
                            }}
                            mr={1}
                          />
                          Join Game...
                        </Box>
                      ) : (
                        "Join Game"
                      )}
                    </JoinButton>
                  </Stack>
                ) : null;
              })}
            </Stack>
          </>
        ) : null}
      </JoinRoomContainer>
    </Box>
  );
}
