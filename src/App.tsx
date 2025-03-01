import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [name, _] = useState("");

  async function greet() {
      // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
      await invoke("greet", { name });
  }

  return <main>
      <p className="text-6xl">Hello World!</p>
  </main>
}

export default App;
