import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  playerSymbol: "x" | "o";
  setPlayerSymbol: (symbol: "x" | "o") => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInRoom: () => {},
  playerSymbol: "x",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlayerSymbol: () => {},
  isPlayerTurn: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlayerTurn: () => {},
  isGameStarted: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setGameStarted: () => {},
};

export default React.createContext(defaultState);
