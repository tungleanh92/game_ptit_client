import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../../../context/gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import { TransactionContext } from "../../../context/TransactionContext-caro";
import { Modal, Button } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { Timer } from '../../../Chess-client/Game/Timer'

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Zen Tokyo Zoo", cursive;
  position: relative;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

interface ICellProps {
  borderTop?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  borderBottom?: boolean;
}

const Cell = styled.div<ICellProps>`
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  border-top: ${({ borderTop }) => borderTop && "2px solid grey"};
  border-left: ${({ borderLeft }) => borderLeft && "2px solid grey"};
  border-bottom: ${({ borderBottom }) => borderBottom && "2px solid grey"};
  border-right: ${({ borderRight }) => borderRight && "2px solid grey"};
  transition: all 270ms ease-in-out;

  &:hover {
    background-color: #8d44ad28;
  }
`;

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const X = styled.span`
  font-size: 21px;
  color: #8e44ad;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 21px;
  color: #8e44ad;
  &::after {
    content: "O";
  }
`;

export type IPlayMatrix = Array<Array<string | null>>;
export interface IStartGame {
  start: boolean;
  symbol: "x" | "o";
}

export function Game() {
  const [matrix, setMatrix] = useState<IPlayMatrix>(new Array(25).fill(null).map(() => (new Array(25).fill(null))));
  const [message, setMessage] = useState('tie')
  const [moveCount, setMoveCount] = useState(0)
  const {
    playerSymbol,
    setPlayerSymbol,
    setPlayerTurn,
    isPlayerTurn,
    setGameStarted,
    isGameStarted,
    setInRoom
  } = useContext(gameContext);
  const [stateP1, setStateP1] = useState({ resume: 0, pause: 0 })
  const [stateP0, setStateP0] = useState({ resume: 0, pause: 0 })
  const { winnerClaim, playerClaimBack, updateBalance } = useContext(TransactionContext);
  const [thisTurn, setThisTurn] = useState('o')

  function checkWin(row: any, col: any, user: any, matrix: any) {
    setMoveCount(moveCount + 1)
    const squares = matrix;

    // Get coordinates
    let coorX = row;
    let coorY = col;

    let countCol = 1;
    let countRow = 1;
    let countMainDiagonal = 1;
    let countSkewDiagonal = 1;
    let isBlock;
    const rival = (user == "x") ? "o" : "x";

    // Check col
    isBlock = true;
    let winCells = [];
    coorX -= 1;
    while (coorX >= 0 && squares[coorX][coorY] === user) {
      countCol += 1;
      winCells.push([coorX, coorY]);
      coorX -= 1;
    }
    if (coorX >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    winCells.push([coorX, coorY]);
    coorX += 1;
    while (coorX <= 25 - 1 && squares[coorX][coorY] === user) {
      countCol += 1;
      winCells.push([coorX, coorY]);
      coorX += 1;
    }
    if (coorX <= 25 - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    if (isBlock === false && countCol >= 5) return winCells;

    // Check row
    isBlock = true;
    winCells = [];
    coorY -= 1;
    while (coorY >= 0 && squares[coorX][coorY] === user) {
      countRow += 1;
      winCells.push([coorX, coorY]);
      coorY -= 1;
    }
    if (coorY >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorY = col;
    winCells.push([coorX, coorY]);
    coorY += 1;
    while (coorY <= 25 - 1 && squares[coorX][coorY] === user) {
      countRow += 1;
      winCells.push([coorX, coorY]);
      coorY += 1;
    }
    if (coorY <= 25 - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorY = col;
    if (isBlock === false && countRow >= 5) return winCells;

    // Check main diagonal
    isBlock = true;
    winCells = [];
    coorX -= 1;
    coorY -= 1;
    while (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] === user) {
      countMainDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX -= 1;
      coorY -= 1;
    }
    if (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    coorY = col;
    winCells.push([coorX, coorY]);
    coorX += 1;
    coorY += 1;
    while (coorX <= 25 - 1 && coorY <= 25 - 1 && squares[coorX][coorY] === user) {
      countMainDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX += 1;
      coorY += 1;
    }
    if (coorX <= 25 - 1 && coorY <= 25 - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    coorY = col;
    if (isBlock === false && countMainDiagonal >= 5) return winCells;

    // Check skew diagonal
    isBlock = true;
    winCells = [];
    coorX -= 1;
    coorY += 1;
    while (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] === user) {
      countSkewDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX -= 1;
      coorY += 1;
    }
    if (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    coorY = col;
    winCells.push([coorX, coorY]);
    coorX += 1;
    coorY -= 1;
    while (coorX <= 25 - 1 && coorY <= 25 - 1 && squares[coorX][coorY] === user) {
      countSkewDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX += 1;
      coorY -= 1;
    }
    if (coorX <= 25 - 1 && coorY <= 25 - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    if (isBlock === false && countSkewDiagonal >= 5) return winCells;
    if (moveCount == 313) {
      return 'tie'
    }
    return null;
  }

  const updateGameMatrix = async (column: number, row: number, symbol: "x" | "o") => {
    const newMatrix = [...matrix];
    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, newMatrix, symbol);
      const result = checkWin(row, column, symbol, newMatrix)
      if (result && result.length == 5) {
        gameService.gameWin(socketService.socket, "lost");
        setMessage('win')
        const rs = message == 'tie' ? "Game tie!" : message == 'lost' ? "You lost!" : "You win!"
        toast(rs);
        // await winnerClaim()
        setInRoom(false)
      }
      if (result == 'tie') {
        gameService.gameWin(socketService.socket, "tie");
        setMessage('tie')
        const rs = message == 'tie' ? "Game tie!" : message == 'lost' ? "You lost!" : "You win!"
        toast(rs);
        await playerClaimBack()
        setInRoom(false)
      }
      if (symbol == 'x') {
        setStateP0({ pause: 1, resume: 0 })
        setStateP1({ pause: 0, resume: 1 })
      }
      else {
        setStateP1({ pause: 1, resume: 0 })
        setStateP0({ pause: 0, resume: 1 })
      }
      if(thisTurn == 'x') {
        setThisTurn('o')
      } else {
        setThisTurn('x')
      }
      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket)
      gameService.onGameUpdate(socketService.socket, (newMatrix, move) => {
        if (move == 'x') {
          setStateP0({ pause: 1, resume: 0 })
          setStateP1({ pause: 0, resume: 1 })
        }
        else {
          setStateP1({ pause: 1, resume: 0 })
          setStateP0({ pause: 0, resume: 1 })
        }
        setMatrix(newMatrix);
        setPlayerTurn(true);
      });
  };

  const handleGameStart = () => {
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, (options) => {
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        if (!options.start) setPlayerTurn(true);
        else setPlayerTurn(false);
      });
  };

  const handleGameWin = () => {
    if (socketService.socket)
      gameService.onGameWin(socketService.socket, async (message) => {
        setMessage(message)
        const rs = message == 'tie' ? "Game tie!" : message == 'lost' ? "You lost!" : "You win!"
        toast(rs);
        if (message == 'tie') {
          await playerClaimBack()
          setInRoom(false)
        }
        if (message == 'win') {
          await winnerClaim()
          setInRoom(false)
        }
        setPlayerTurn(false);
      });

    updateBalance()
  };

  async function handleExpireTime() {
    if (socketService.socket) {
      if (thisTurn == 'x') {
        gameService.gameWin(socketService.socket, "win");
        setMessage('lost')
        const rs = message == 'tie' ? "Game tie!" : message == 'lost' ? "You lost!" : "You win!"
        toast(rs);
        setInRoom(false)
        console.log("you lost!");
      }
      if (thisTurn == 'o') {
        gameService.gameWin(socketService.socket, "win");
        setMessage('lost')
        const rs = message == 'tie' ? "Game tie!" : message == 'lost' ? "You lost!" : "You win!"
        toast(rs);
        setInRoom(false)
        console.log("you lost!");
      }
    }
  }

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, []);

  useEffect(() => {
    if(isGameStarted) {
      setStateP0({ pause: 0, resume: 1 })
    }
  }, [isGameStarted])

  return (
    <GameContainer>
      <ToastContainer />
      {!isGameStarted && (
        <>
          <h2 style={{ color: "#8e44ad" }}>Waiting for Other Player to Join to Start the Game!</h2>
          <Button style={{ zIndex: 100 }} onClick={async () => {
            await playerClaimBack()
            if (socketService.socket) {
              socketService.socket.emit("update_waiting_games");
            }
            setInRoom(false)
          }
          }>
            Back Home
          </Button>
        </>
      )}
      {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
      <Timer
        state={stateP0}
        onExpireTime={handleExpireTime}
        name={"Host: "} />
      <Timer
        state={stateP1}
        onExpireTime={handleExpireTime}
        name={"Guest: "} />
      {matrix.map((row, rowIdx) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <RowContainer>
            {row.map((column, columnIdx) => (
              // eslint-disable-next-line react/jsx-key
              <Cell
                borderRight={columnIdx < 24}
                borderLeft={columnIdx > 0}
                borderBottom={rowIdx < 24}
                borderTop={rowIdx > 0}
                onClick={() =>
                  updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                }
              >
                {column && column !== null ? (
                  column === "x" ? (
                    <X />
                  ) : (
                    <O />
                  )
                ) : null}
              </Cell>
            ))}
          </RowContainer>
        );
      })}
    </GameContainer>
  );
}