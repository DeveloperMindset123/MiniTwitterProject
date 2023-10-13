import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Landing from "./Landing";
import Home from "./Home";
import User from "./User";
import Upload from "./Upload";

// import AboutPage from "./AboutPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" element={Landing}/>
        <Route exact path="/home" element={Home} />
        <Route exact path="/user" element={User} />
        <Route exact path="/upload" element={Upload} />
      </Switch>
    </Router>
  );
};

export default App;