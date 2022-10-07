import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Game from "./pages/Game";
import NoMatch from "./pages/NoMatch";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import GameHistory from "./pages/GameHistory";
import GameResults from "./pages/GameResults";
// import { StoreProvider } from './utils/GlobalState'

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/gamehistory" component={GameHistory} />
              <Route exact path="/game/:id" component={Game} />
              <Route exact path="/results/:id" component={GameResults} />
              <Route component={NoMatch} />
            </Switch>
          </Layout>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
