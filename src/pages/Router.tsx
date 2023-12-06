import { Switch, Route } from "react-router-dom";
import { DatacontextProvider } from "../context/Datacontext";
import { TransactionsProvider } from "../context/TransactionContext";
import { TransactionsProviderCaro } from "../context/TransactionContext-caro";
import FaucetClaim from "./FaucetClaimApp";
import CaroApp from "./CaroApp";
import Layout from "./layout/Layout";
import Home from "./Home";
import { AppProvider } from "../context/AppContext";
import { Join } from "../Chess-client/Join/Join";
import { Lobby } from "../Chess-client/Lobby/Lobby";
import WagmiProvider from "../connect-wallet/provider";

const Router = () => {
  return (
    <Switch>
      <WagmiProvider>
        <AppProvider>
          <Layout>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/caro">
              <TransactionsProviderCaro>
                <CaroApp />
              </TransactionsProviderCaro>
            </Route>
            <DatacontextProvider>
              <Route exact path="/chess">
                <Join />
              </Route>
              <Route exact path="/chess/game/:gameId">
                <Lobby />
              </Route>
            </DatacontextProvider>

            <Route exact path="/faucet-claim">
              <TransactionsProvider>
                <FaucetClaim />
              </TransactionsProvider>
            </Route>
          </Layout>
        </AppProvider>
      </WagmiProvider>
    </Switch>
  );
};

export default Router;
