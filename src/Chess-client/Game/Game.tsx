import React, { useState, useContext, useEffect, useRef } from "react";
// import useSound from "use-sound";
// import chessSound from "./chess_move.mp3";
import { Datacontext } from "../../context/Datacontext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Chat } from "../Chat/Chat";
import "./Game.css";
import { useHistory } from "react-router-dom";
import { Chess } from "chess.js";
import { Timer } from "./TimerV2";
import { Chessboard, Square, Pieces } from "react-chessboard";
import { ToastContainer, toast } from "react-toastify";

const lastRows = [
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1",
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
];

export const Game = () => {
  const childRef0 = useRef<any>();
  const childRef1 = useRef<any>();
  const history = useHistory();
  const [chess, setChess] = useState(new Chess());
  const [playerTurn, setPlayerTurn] = useState("w");
  const [usernames, setUsernames] = useState([]);
  const [isStart, setIsStart] = useState(false);
  // const [playSound] = useSound(chessSound);
  const [open, setOpen] = useState(false);
  const {
    username,
    socket,
    gameId,
    joinGame,
    wallet,
    winnerClaim,
    setRedirect,
    playerClaimBack,
  } = useContext<any>(Datacontext);
  const [gameDraw, setGameDraw] = useState(false);
  const [stateP1, setStateP1] = useState(false); // { resume: 0, pause: 0 }
  const [stateP0, setStateP0] = useState(true); // { resume: 1, pause: 0 }

  function resign() {
    if (playerTurn == "w" && username == usernames[0]) {
      socket.emit("clickResign", { gameId: gameId, player: "w" });
    }
    if (playerTurn == "b" && username == usernames[1]) {
      socket.emit("clickResign", { gameId: gameId, player: "b" });
    } else {
      toast("Not your turn");
    }
  }

  useEffect(() => {
    socket.on("initiateResign", async (data: any) => {
      if (playerTurn == "w" && data.player == "w" && username == usernames[1]) {
        await winnerClaim();
        console.log("you win!");
      }
      if (playerTurn == "b" && data.player == "b" && username == usernames[0]) {
        await winnerClaim();
        console.log("you win!");
      }
      setOpen(true);
    });

    return () => {
      socket.off("initiateResign");
    };
  });

  const onDrop = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Pieces
  ) => {
    let tmpTargetSquare =
      piece.slice(-1) == "P" ? targetSquare : piece.slice(-1) + targetSquare;
    if (piece.slice(-1) == "P") {
      tmpTargetSquare = targetSquare;
    } else {
      tmpTargetSquare = piece.slice(-1) + targetSquare;
    }
    if (chess.get(targetSquare) && piece.slice(-1) == "P") {
      tmpTargetSquare = sourceSquare[0] + "x" + targetSquare;
    } else if (chess.get(targetSquare) && piece.slice(-1) != "P") {
      tmpTargetSquare = piece.slice(-1) + "x" + targetSquare;
    }
    if (
      piece.slice(-1) == "K" &&
      targetSquare[0] == "g" &&
      (targetSquare.slice(-1) == "1" || targetSquare.slice(-1) == "8")
    ) {
      tmpTargetSquare = "O-O";
    } else if (
      piece.slice(-1) == "K" &&
      (targetSquare[0] == "c" || targetSquare[0] == "b") &&
      (targetSquare.slice(-1) == "1" || targetSquare.slice(-1) == "8")
    ) {
      tmpTargetSquare = "O-O-O";
    }
    console.log(tmpTargetSquare);
    console.log(chess.moves({ square: sourceSquare }));
    const player = usernames[0] == username ? "w" : "b";
    if (player == playerTurn) {
      const validMove = chess
        .moves({ square: sourceSquare })
        .find((element) => {
          if (element.includes(tmpTargetSquare)) {
            return true;
          }
        });
      // if (!validMove && targetSquare != 'O-O' && targetSquare != 'O-O-O') {
      if (!validMove) {
        toast("Invalid move");
      }
      socket.emit("move", {
        initialCoordinate: sourceSquare,
        endCoordinate: targetSquare,
        gameId: gameId,
        piece: piece,
      });
    } else {
      toast("Not your turn");
    }
    return true;
  };

  function handleClose() {
    setOpen(false);
    setRedirect(false);
    return history.push("/chess");
  }

  useEffect(() => {
    socket.on("userMove", async (state: any) => {
      console.log("userMove");
      if (
        lastRows.includes(state.endCoordinate) &&
        state.piece.slice(-1) == "P"
      ) {
        chess.move({
          from: state.initialCoordinate,
          to: state.endCoordinate,
          promotion: "q",
        });
      } else {
        chess.move({ from: state.initialCoordinate, to: state.endCoordinate });
      }
      setChess(chess);
      if (playerTurn == "w") {
        console.log("white turn");
        if (childRef0 && childRef0.current) {
          childRef0.current.addSeconds();
        }
        setStateP0(false); // { pause: 1, resume: 0 }
        setStateP1(true); // { pause: 0, resume: 1 }
      }
      if (playerTurn == "b") {
        console.log("black turn");
        if (childRef1 && childRef1.current) {
          childRef1.current.addSeconds();
        }
        setStateP1(false); // { pause: 1, resume: 0 }
        setStateP0(true); // { pause: 0, resume: 1 }
      }
      setPlayerTurn(playerTurn == "w" ? "b" : "w");
      // playSound();
      if (chess.in_checkmate()) {
        setOpen(true);
        if (playerTurn == "w" && username == usernames[0]) {
          await winnerClaim();
          console.log("you win!");
        }
        if (playerTurn == "b" && username == usernames[1]) {
          await winnerClaim();
          console.log("you win!");
        }
      }
      if (
        chess.in_draw() ||
        chess.in_stalemate() ||
        chess.in_threefold_repetition() ||
        chess.insufficient_material()
      ) {
        setGameDraw(true);
        setOpen(true);
        await playerClaimBack();
        console.log("game draw!");
      }
    });
    return () => {
      socket.off("userMove");
    };
  });

  useEffect(() => {
    let called = false;
    socket.emit("shouldGameStart", gameId);
    socket.on("start game", async (users: any) => {
      if (!called) {
        called = true;
        await joinGame();
        setIsStart(true);
        setUsernames(users);
      }
    });
  }, []);

  async function handleExpireTime() {
    if (playerTurn == "w" && username == usernames[1]) {
      await winnerClaim();
      console.log("you win!");
    }
    if (playerTurn == "b" && username == usernames[0]) {
      await winnerClaim();
      console.log("you win!");
    }
    setOpen(true);
  }

  return (
    <>
      <div className="Game">
        {isStart ? (
          <>
            <div className="game-container">
              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  {gameDraw ? (
                    <DialogTitle id="alert-dialog-title">{`Game draw!`}</DialogTitle>
                  ) : (
                    <DialogTitle id="alert-dialog-title">{`${
                      playerTurn == "w" ? usernames[1] : usernames[0]
                    } wins!`}</DialogTitle>
                  )}
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description"></DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                      Back home
                    </Button>
                  </DialogActions>
                </Dialog>
                <h1 style={{ color: "#3f51b5" }}>Timer</h1>
                <Timer
                  state={stateP0}
                  onExpireTime={handleExpireTime}
                  name={usernames[0]}
                  ref={childRef0}
                />
                <Timer
                  state={stateP1}
                  onExpireTime={handleExpireTime}
                  name={usernames[1]}
                  ref={childRef1}
                />
                <h1 style={{ color: "#3f51b5" }}>
                  {usernames[0] === username ? usernames[1] : usernames[0]}
                </h1>
                <Chessboard
                  position={chess.fen()}
                  onPieceDrop={onDrop}
                  boardOrientation={
                    usernames[0] === username ? "white" : "black"
                  }
                />
                <h1 style={{ color: "#3f51b5" }}>
                  {usernames[0] === username ? usernames[0] : usernames[1]}
                </h1>
                <Button onClick={resign} variant="contained" color="primary">
                  Resign
                </Button>
              </div>
              <Chat />
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "#3f51b5" }} className="game-lobby-container">
              <h1>Welcome to Online Chess!</h1>
              <p>
                Hey {username}! This app was made so that you can play chess
                with your friends at the comfort of your own home!
              </p>
              <div>
                <p>Waiting for the other one to start ...</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
