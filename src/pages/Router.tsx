import { Switch, Route } from "react-router-dom";
import { DatacontextProvider } from "../context/Datacontext";
import { TransactionsProvider } from "../context/TransactionContext";
import { TransactionsProviderCaro } from "../context/TransactionContext-caro";
import FaucetClaim from "./FaucetClaimApp";
import CaroApp from "./CaroApp";
import ChessApp from "./ChessApp";
import Layout from "./layout/Layout";
import Home from "./Home";
import { AppProvider } from "../context/AppContext";

const Router = () => {
  return (
    <Switch>
      <AppProvider>
        <Layout>
          <Route exact path="/" component={Home}></Route>
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
        </Layout>
      </AppProvider>
    </Switch>
  );
};

export default Router;
