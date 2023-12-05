import { useContext } from "react";
import "./Lobby.css";
import { Datacontext } from "../../context/Datacontext";
import { Game } from "../Game/Game";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";

export const Lobby = () => {
  const { username, Setusername, redirect, setRedirect, generateGameId } =
    useContext<any>(Datacontext);
  return <>{!username ? <Redirect to={"/chess"} /> : <Game />}</>;
};
