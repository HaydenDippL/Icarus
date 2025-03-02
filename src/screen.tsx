export enum DaisyUIColor {
    neutral = "neutral",
    primary = "primary",
    secondary = "secondary",
    accent = "accent",
    success = "success",
    warning = "warning",
    info = "info",
    error = "error"
};

type ScreenProps = {
    name: string,
    color: DaisyUIColor,
    last: boolean
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
    return <div className="relative flex flex-col items-center">
        <span>|</span>
        <span className="absolute top-4">{ MIN + (i * DIVIDER_STEP) }</span>
    </div>
});

export default function Screen({ name, color, last }: ScreenProps) {

    return <div id={`${name}-controller`} className="flex flex-row">
        <div className="flex flex-col text-center w-48 -mt-4">
            <p className="text-4xl font-semibold">{ name }</p>
            <p className="text-xl font-medium opacity-40">1920x1080</p>
        </div>
        <div className="flex flex-col">
            <input className={`range range-${color} w-4xl`} type="range" min={MIN} max={MAX} step={STEP}/>
            { last &&  <div className="flex flex-row justify-between px-2.5 mt-2 text-xs">
                { dividers }
            </div> }
        </div>
        <button className={`btn btn-${color} btn-lg -mt-2 ml-8`}>Apply</button>
    </div>
}