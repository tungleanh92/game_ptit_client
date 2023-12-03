import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Join } from "../Chess-client/Join/Join";
import { Lobby } from "../Chess-client/Lobby/Lobby";

function ChessApp() {
    return (
        <>
            <Router>
                <Route exact path="/chess">
                    <Join />
                </Route>
                <Route exact path="/chess/game/:gameId">
                    <Lobby />
                </Route>
            </Router>
        </>
    )
}

export default ChessApp