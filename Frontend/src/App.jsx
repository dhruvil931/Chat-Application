import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import toast from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  const notify = () => toast("Here is your toast.");

  return (
    <>
      <button onClick={notify}>Make me a toast</button>
      <h1>This is main page</h1>
    </>
  );
}

export default App;
