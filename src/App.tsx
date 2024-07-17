import { useEffect, useRef, lazy, Suspense } from "react";
import GridLoader from "react-spinners/GridLoader";
import BackgroundMusic from "./assets/sound/background_music.mp3";

import "./App.css";
import { useAppDispatch, useStateSelector } from "./store/hooks";
import { selectMusicSettings } from "./store/slices/settingsSlice";
import { wsConnect } from "./store/slices/socketSlice";

const ReactRouterProvider = lazy(async () =>
    import("@/router/provider").then(module => ({
        default: module.ReactRouterProvider
    }))
);

export const App = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const dispatch = useAppDispatch();
    const musicEnabled = useStateSelector(state => selectMusicSettings(state));

    useEffect(() => {
        if (musicEnabled) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [musicEnabled]);

    useEffect(() => {
        window.addEventListener(
            "click",
            () => {
                if (musicEnabled) {
                    audioRef.current?.play();
                }
            },
            { once: true }
        );
        dispatch(wsConnect());
    }, []);

    return (
        <>
            <Suspense
                fallback={
                    <GridLoader
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        color={"red"}
                    />
                }
            >
                <ReactRouterProvider />
            </Suspense>
            <audio
                loop
                autoPlay
                preload="auto"
                ref={audioRef}
            >
                <source
                    src={BackgroundMusic}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>
        </>
    );
};
