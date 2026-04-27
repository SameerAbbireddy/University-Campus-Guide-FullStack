import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [screen, setScreen] = useState("landing");

  return (
    <>
      {screen === "landing" && <Landing setScreen={setScreen} />}
      {screen === "login" && <Login setScreen={setScreen} />}
      {screen === "signup" && <Signup setScreen={setScreen} />}
      {screen === "dashboard" && <Dashboard setScreen={setScreen} />}
    </>
  );
}

export default App;