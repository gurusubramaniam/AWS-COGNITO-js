import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from "./components/Header/Nav";
import Home from "./components/Home";
import Signin from "./components/SignIn";
import Signup from "./components/Signup";
import SecondHome from "./components/SecondHome";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Route exact path="/" component={Home} />
        <Route exact path="/secondhome" component={SecondHome} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
      </Router>
    </div>
  );
}

export default App;
