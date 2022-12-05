import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Signin from "./signin/Signin";
import Chat from "./chat/Chat";
import Verify from "./Verify/Verify";
import "./App.css";

export const AppContext = React.createContext();
const App = (props) => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Verify {...props} />} />
          <Route
            exact
            path="/chat"
            render={(props) => <Signin {...props} />}
          />
          <Route exact path="/chatroom" render={(props) => <Chat {...props} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
