import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

type ScreenProps = {
    name: string,
    ticks: boolean
};

const MIN: number = 20;
const MAX: number = 100;
const STEP: number = 5;
const DIVIDER_STEP: number = 10;

if ((MAX - MIN) % STEP !== 0)
    alert("STEP MUST DIVIDE DIFFERENCE OF MIN AND MAX");

if ((MAX - MIN) % DIVIDER_STEP !== 0)
    alert("DIVIDER_STEP MUST DIVIDE DIFFERENCE OF MIN AND MAX");

const dividers: JSX.Element[] = Array.from({ length: (MAX - MIN) / DIVIDER_STEP + 1 }).map((_, i) => {
    return <div key={i} className="relative flex flex-col items-center opacity-60 font-medium">
        <span>|</span>
        <span className="absolute top-4">{ MIN + (i * DIVIDER_STEP) }</span>
    </div>
});

type ScreenInfo = {
    name: string,
    resolution: string,
    brightness: number
};

export default function Screen({ name, ticks }: ScreenProps) {
    const [screen_info, set_screen_info] = useState<ScreenInfo | null>();
    const [current_brightness, set_current_brightness] = useState<number>(1.0);
    const [target_brightness, set_target_brightness] = useState<number>((MAX + MIN) / 2);

    async function get_screen_info() {
        try {
            const info: ScreenInfo = await invoke("get_screen_info", { name });
            set_screen_info(info);
            set_current_brightness(info.brightness * 100);
            set_target_brightness(info.brightness * 100);
        } catch (err) {
            console.error(err);
        }
    }

    async function set_screen_brightness() {
        try {
            await invoke("set_screen_brightness", { name, brightness: target_brightness / 100 });
            set_current_brightness(target_brightness);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        get_screen_info();
    }, []);

    return <div className="flex flex-row">
        <div className="flex flex-col text-center w-48 -mt-4">
            <p className="text-4xl font-semibold">{ name }</p>
            <p className="text-xl font-medium opacity-60">{ screen_info?.resolution || "" }</p>
        </div>
        <div className="flex flex-col">
            <input
                className={`range range-primary w-md lg:w-2xl xl:w-4xl`}
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={target_brightness}
                onChange={(e) => set_target_brightness(parseInt(e.target.value))}
            />
            { ticks &&  <div className="flex flex-row justify-between px-2.5 mt-2 text-xs">
                { dividers }
            </div> }
        </div>
        <button
            className={`btn btn-primary btn-lg -mt-2 ml-8`}
            disabled={target_brightness === current_brightness}
            onClick={() => set_screen_brightness()}
        >Apply</button>
    </div>
}