import React from "react";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Nav from "./Nav";
import GestureWrapperLayer from "./GestureWrapperLayer";
import "./styles.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <GestureWrapperLayer>
        <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/shop" component={Shop} />
          </Switch>
        </div>
      </GestureWrapperLayer>
    </Router>
  );
}
