import { useId } from "react";

import { useStateSelector, useAppDispatch } from "@/store/hooks";
import {
    toggleSound,
    toggleMusic,
    toggleAnimation,
    selectSettings
} from "@/store/slices/settingsSlice";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const GameSettings = () => {
    const soundId = useId();
    const musicId = useId();
    const animationId = useId();

    const botState = useStateSelector(state => state.test.botState);

    const { soundEnabled, musicEnabled, animationEnabled } = useStateSelector(
        state => selectSettings(state)
    );
    const dispatch = useAppDispatch();

    return (
        <ul>
            {botState.status === "active" ? (
                <>
                    <li className="flex justify-between bg-[#1b1c1d] px-2.5 py-2">
                        <Label
                            htmlFor={soundId}
                            direction="row"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="16"
                                viewBox="0 0 15 16"
                            >
                                <g
                                    fill="#767B85"
                                    fillRule="nonzero"
                                >
                                    <path d="M9.836.137A1.031 1.031 0 0 0 8.74.183L4.127 4.086H.507a.34.34 0 0 0-.34.34v6.468a.339.339 0 0 0 .34.34l3.612-.001 4.61 4.235c.017.016.036.03.055.04a1.04 1.04 0 0 0 1.052.016c.34-.192.543-.543.543-.938V1.076c0-.396-.203-.747-.543-.94zm-.138 14.449a.39.39 0 0 1-.197.345.357.357 0 0 1-.34.009l-4.569-4.197V9.192a.34.34 0 1 0-.68 0v1.36l-3.065.002V4.766h3.064v1.362a.34.34 0 1 0 .681 0V4.584L9.155.724a.356.356 0 0 1 .346.006.39.39 0 0 1 .197.345v13.51zM11.495 3.248a.34.34 0 0 0-.189.654 3.931 3.931 0 0 1 2.827 3.758 3.931 3.931 0 0 1-2.827 3.759.34.34 0 0 0 .189.654 4.616 4.616 0 0 0 3.319-4.413 4.616 4.616 0 0 0-3.32-4.412z" />
                                </g>
                            </svg>
                            <span>Звук</span>
                        </Label>
                        <Switch
                            id={soundId}
                            checked={soundEnabled}
                            onCheckedChange={() => {
                                dispatch(toggleSound());
                            }}
                        />
                    </li>
                    <DropdownMenuSeparator />
                </>
            ) : null}

            <li className="flex justify-between bg-[#1b1c1d] px-2.5 py-2">
                <Label
                    htmlFor={musicId}
                    direction="row"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="18"
                        viewBox="0 0 16 18"
                    >
                        <path
                            fill="#767B85"
                            fillRule="nonzero"
                            d="M15.864 3.87V.498a.502.502 0 0 0-.202-.402.506.506 0 0 0-.446-.073L5.168 3.215a.498.498 0 0 0-.346.475v9.835c-.527-.365-1.2-.564-1.907-.564-.748 0-1.458.225-2 .63-.581.438-.902 1.03-.902 1.675s.32 1.237.902 1.676c.542.405 1.248.63 2 .63.75 0 1.458-.225 1.999-.63.582-.439.902-1.031.902-1.676V7.431l9.054-2.88v5.767c-.526-.365-1.2-.564-1.907-.564-.748 0-1.458.225-2 .63-.581.438-.902 1.03-.902 1.675s.32 1.237.902 1.675c.542.406 1.249.63 2 .63.75 0 1.458-.224 2-.63.58-.438.901-1.03.901-1.675V3.874 3.87zM2.914 16.577c-1.034 0-1.907-.6-1.907-1.31 0-.711.873-1.312 1.908-1.312 1.034 0 1.907.6 1.907 1.311 0 .715-.873 1.311-1.907 1.311zM5.817 6.385V4.051l9.054-2.876V3.51L5.816 6.385zm7.15 6.985c-1.034 0-1.907-.6-1.907-1.31 0-.711.873-1.312 1.907-1.312 1.035 0 1.908.6 1.908 1.311-.004.71-.877 1.311-1.908 1.311z"
                        />
                    </svg>
                    <span>Музыка</span>
                </Label>
                <Switch
                    id={musicId}
                    checked={musicEnabled}
                    onCheckedChange={() => {
                        dispatch(toggleMusic());
                    }}
                />
            </li>

            <DropdownMenuSeparator />

            {botState.status === "active" ? (
                <>
                    <li className="flex justify-between bg-[#1b1c1d] px-2.5 py-2">
                        <Label
                            htmlFor={animationId}
                            direction="row"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="16"
                                viewBox="0 0 18 16"
                            >
                                <path
                                    fill="#767B85"
                                    fillRule="nonzero"
                                    d="M17.337 13.35c-.46-.654-1.362-1.38-2.608-2.1-1.226-.708-2.681-1.307-3.784-1.568a2.161 2.161 0 0 0-.85-1.473c.324-1.085.534-2.645.534-4.061 0-1.44-.178-2.584-.515-3.309A1.454 1.454 0 0 0 8.8 0c-.562 0-1.078.33-1.314.84-.337.724-.515 1.868-.515 3.308 0 1.416.21 2.976.534 4.061-.46.346-.779.872-.85 1.473-1.103.261-2.558.86-3.784 1.568-1.246.72-2.148 1.446-2.608 2.1a1.454 1.454 0 0 0-.07 1.558 1.454 1.454 0 0 0 1.384.718c.796-.071 1.876-.49 3.123-1.209 1.226-.708 2.472-1.669 3.25-2.493a2.148 2.148 0 0 0 1.7 0c.778.824 2.024 1.785 3.25 2.493 1.247.72 2.327 1.138 3.123 1.209a1.454 1.454 0 0 0 1.384-.718 1.454 1.454 0 0 0-.07-1.558zM8.06 4.148c0-1.705.26-2.518.413-2.85a.361.361 0 0 1 .327-.21c.14 0 .268.083.327.21.154.332.413 1.145.413 2.85 0 1.26-.183 2.674-.459 3.648a2.169 2.169 0 0 0-.562 0c-.276-.974-.459-2.389-.459-3.648zm-3.905 9.326c-1.477.853-2.31 1.035-2.675 1.068a.361.361 0 0 1-.326-.566c.21-.3.785-.93 2.261-1.783 1.09-.63 2.407-1.179 3.39-1.427.072.175.167.338.281.486-.706.727-1.84 1.592-2.93 2.222zm3.573-3.536a1.073 1.073 0 0 1 2.144 0 1.073 1.073 0 0 1-2.144 0zm8.736 4.425a.362.362 0 0 1-.344.179c-.365-.033-1.198-.215-2.675-1.068-1.09-.63-2.225-1.495-2.931-2.222a2.16 2.16 0 0 0 .282-.486c.982.248 2.298.797 3.389 1.427 1.476.853 2.05 1.483 2.261 1.783.08.114.088.266.018.387z"
                                />
                            </svg>
                            <span>Анимация</span>
                        </Label>
                        <Switch
                            id={animationId}
                            checked={animationEnabled}
                            onCheckedChange={() => {
                                dispatch(toggleAnimation());
                            }}
                        />
                    </li>
                </>
            ) : null}
        </ul>
    );
};
