import React from "react";
import "./index.css";
import "./styles/global.css";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "@/components/pages/Login";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
