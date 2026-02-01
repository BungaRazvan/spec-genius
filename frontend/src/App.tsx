import "./index.css";
import "./styles/globals.css";

import { Routes, Route } from "react-router-dom";

import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
import Layout from "components/Layout";
import SpecificationDocument from "./pages/SpecificationDocument";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signin" Component={Login}></Route>

        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="/document" element={<SpecificationDocument />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
