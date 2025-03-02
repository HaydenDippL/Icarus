import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import Screen, { DaisyUIColor } from "./screen";

function App() {
    const [name, _] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        await invoke("greet", { name });
    }

    return <main className="flex flex-col w-full min-h-screen justify-center items-center">
        <p className="text-8xl font-bold tracking-tighter">Icarus</p>
        <p className="text-3xl font-semibold mt-6">Don't fly too close to the <span className="text-[#FFBA4B]">sun</span></p>
        <div className="flex flex-col gap-4 items-center mt-16 gap-12">
            <Screen name={"HDMI-0"} color={DaisyUIColor.secondary} last={false} />
            <Screen name={"HDMI-1"} color={DaisyUIColor.primary} last={true} />
        </div>
    </main>
}

export default App;
