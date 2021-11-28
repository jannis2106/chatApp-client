import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Chat } from "./pages/Chat";
import { Profile } from "./pages/Profile";
import { CreateRoom } from "./components/Chat/CreateRoom";
import "./sass/main.sass";
import { Loading } from "./components/Loading";
import { AnimatePresence } from "framer-motion";
import useStore from "./zustand/store";
import { gql, useQuery } from "@apollo/client";

const LOGGED_IN_QUERY = gql`
  query loggedIn {
    loggedIn
  }
`;

const App = () => {
  const { data: loggedInData } = useQuery(LOGGED_IN_QUERY);
  // const loggedIn = useStore((state) => state.loggedIn);
  const setLoggedIn = useStore((state) => state.setLoggedIn);

  if (loggedInData?.loggedIn === false) {
    setLoggedIn(false);
  }
  if (loggedInData?.loggedIn) {
    setLoggedIn(true);
  }

  return (
    <Router>
      <AnimatePresence>
        <Switch>
          <Route exact path="/">
            <Chat />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/profile">
            <Profile />
          </Route>

          <Route path="/createRoom">
            <CreateRoom />
          </Route>

          <Route path="/test">
            <Loading />
          </Route>
        </Switch>
      </AnimatePresence>
    </Router>
  );
};

export default App;
