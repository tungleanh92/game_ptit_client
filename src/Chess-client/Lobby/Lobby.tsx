import React, { useContext } from "react";
import "./Lobby.css";
import { Datacontext } from "../../context/Datacontext";
import { Game } from "../Game/Game";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useEffect } from "react";

export const Lobby = () => {
    const { username, Setusername, redirect, setRedirect, generateGameId } = useContext<any>(Datacontext);

    useEffect(() => {
        if (username !== "") {
            setRedirect(true);
        }
    }, [])
    return (
        <Game />
    )
}