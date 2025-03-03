import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import Screen from "./screen";

function App() {
    const [screen_names, set_screen_names] = useState<string[]>([]);

    async function get_screen_names() {
        try {
            set_screen_names(await invoke("get_connected_screens"))
        } catch (err) {
            console.error(err);
            set_screen_names([]);
        }
    }

    useEffect(() => {
        get_screen_names();
    }, []);

    return <main className="flex flex-col w-full min-h-screen justify-center items-center">
        <p className="text-8xl font-bold tracking-tighter">Icarus</p>
        <p className="text-3xl font-semibold mt-6">Don't fly too close to the <span className="text-primary">sun</span></p>
        <div className="flex flex-col gap-4 items-center mt-16 gap-12">
            { screen_names.map((name, i) => <Screen key={i} name={name} ticks={true} />) }
        </div>
    </main>
}

export default App;
