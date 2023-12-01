import React, { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";
// import OsuApp from './OsuApp'
import CaroApp from './CaroApp'
import ChessApp from './ChessApp'
import FaucetClaim from './FaucetClaimApp'
import { DatacontextProvider } from './context/Datacontext';
import { TransactionsProvider } from './context/TransactionContext'
import { TransactionsProviderCaro } from './context/TransactionContext-caro';

const App = () => {
    return (
        <div className="App">
            <Router>
                {/* <NavLink
                    to="/osu"
                >
                    Osu
                </NavLink> */}
                <NavLink
                    to="/caro"
                >
                    Caro
                </NavLink>
                <NavLink
                    to="/chess"
                >
                    Chess
                </NavLink>
                <NavLink
                    to="/faucet-claim"
                >
                    Claim token
                </NavLink>
                <Switch>
                    {/* <Route exact path="/osu">
                        <TransactionsProvider>
                            <div style={{background: '#000316'}}>
                                <OsuApp />
                            </div>
                        </TransactionsProvider>
                    </Route> */}
                    <Route exact path="/caro">
                        <TransactionsProviderCaro>
                            <CaroApp />
                        </TransactionsProviderCaro>
                    </Route>
                    <Route exact path="/chess">
                        <DatacontextProvider>
                            <ChessApp />
                        </DatacontextProvider>
                    </Route>
                    <Route exact path="/faucet-claim">
                        <TransactionsProvider>
                            <FaucetClaim />
                        </TransactionsProvider>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;