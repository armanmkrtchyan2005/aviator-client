import { useRef, useEffect } from "react";

import { useStateSelector } from "@/store/hooks";
import { selectAirplaneState } from "@/store/slices/test.slice";
import { selectSoundSettings } from "@/store/slices/settingsSlice";

import TakeOnSound from "@/assets/sound/take-on.mp3";
import TakeOffSound from "@/assets/sound/take-off.mp3";

export const SoundEffects = () => {
    const takeOnAudioRef = useRef<HTMLAudioElement>(null);
    const takeOffAudioRef = useRef<HTMLAudioElement>(null);
    // const [gameStarted, setGameStarted] = useState(false);

    // const socket = useStateSelector(state => selectSocket(state));
    const soundEnabled = useStateSelector(state => selectSoundSettings(state));
    const roundState = useStateSelector(state => selectAirplaneState(state));

    useEffect(() => {
        // const playStartRoundSound = () => {
        //     if (!soundEnabled) {
        //         // socket.off("game", playStartRoundSound);
        //         return;
        //     }

        //     if (gameStarted) {
        //         // socket.off("game", playStartRoundSound);
        //         return;
        //     }

        //     if (!takeOnAudioRef.current) return;

        //     takeOnAudioRef.current.currentTime = 0.6;
        //     takeOnAudioRef.current?.play();
        //     setGameStarted(true);
        // };

        // const playFinishRoundSound = () => {
        //     if (!soundEnabled) {
        //         // socket.off("crash", playFinishRoundSound);
        //         return;
        //     }

        //     if (!takeOnAudioRef.current || !takeOffAudioRef.current) return;

        //     setGameStarted(false);
        //     takeOnAudioRef.current.pause();
        //     takeOnAudioRef.current.currentTime = 0;
        //     takeOffAudioRef.current.currentTime = 0.8;

        //     takeOffAudioRef.current?.play();
        // };

        if (roundState === "start") {
            if (!takeOnAudioRef.current) return;

            takeOnAudioRef.current.currentTime = 0.6;
            takeOnAudioRef.current?.play();
            // setGameStarted(true);
        }

        if (roundState === "crash") {
            if (
                !soundEnabled ||
                !takeOnAudioRef.current ||
                !takeOffAudioRef.current
            ) {
                // socket.off("crash", playFinishRoundSound);
                return;
            }

            // setGameStarted(false);
            takeOnAudioRef.current.pause();
            // takeOnAudioRef.current.currentTime = 0;
            takeOffAudioRef.current.currentTime = 0.8;

            takeOffAudioRef.current?.play();
        }

        // socket.on("game", playStartRoundSound);
        // socket.on("crash", playFinishRoundSound);

        // return () => {
        // socket.off("game", playStartRoundSound);
        // socket.off("crash", playFinishRoundSound);
        // };
    }, [soundEnabled, roundState]);

    if (!soundEnabled) {
        return <></>;
    }

    return (
        <>
            <audio
                preload="auto"
                ref={takeOnAudioRef}
            >
                <source
                    src={TakeOnSound}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>

            <audio
                preload="auto"
                ref={takeOffAudioRef}
            >
                <source
                    src={TakeOffSound}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>
        </>
    );
};
