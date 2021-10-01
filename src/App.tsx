import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Chat } from "./pages/Chat";
import { Profile } from "./pages/Profile";
import { CreateRoom } from "./components/Chat/CreateRoom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Chat />
        </Route>
      </Switch>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
      <Switch>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
      <Switch>
        <Route path="/createRoom">
          <CreateRoom />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
