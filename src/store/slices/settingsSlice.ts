import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootStore } from "../types";

interface Settings {
    animationEnabled: boolean;
    musicEnabled: boolean;
    soundEnabled: boolean;
}

const initialState: Settings = {
    animationEnabled: true,
    soundEnabled: false,
    musicEnabled: false
};

const settingsSlice = createSlice({
    name: "settings",
    initialState: () => {
        const storedData = sessionStorage.getItem("settings");

        if (!storedData) return initialState;

        return JSON.parse(storedData);
    },
    reducers: {
        toggleAnimation: state => {
            state.animationEnabled = !state.animationEnabled;
            sessionStorage.setItem("settings", JSON.stringify(state));
        },
        toggleSound: state => {
            state.soundEnabled = !state.soundEnabled;
            sessionStorage.setItem("settings", JSON.stringify(state));
        },
        toggleMusic: state => {
            state.musicEnabled = !state.musicEnabled;
            sessionStorage.setItem("settings", JSON.stringify(state));
        }
    }
});

export const { reducer: settingsReducer, actions: settingsActions } =
    settingsSlice;

export const { toggleSound, toggleMusic, toggleAnimation } =
    settingsSlice.actions;

const soundSettings = (state: RootStore) => state.settings.soundEnabled;
const musicSettings = (state: RootStore) => state.settings.musicEnabled;
const animationSettings = (state: RootStore) => state.settings.animationEnabled;

export const selectSoundSettings = createSelector(
    [soundSettings],
    soundEnabled => soundEnabled
);

export const selectMusicSettings = createSelector(
    [musicSettings],
    musicEnabled => musicEnabled
);

export const selectAnimationSettings = createSelector(
    [animationSettings],
    animationEnabled => animationEnabled
);

export const selectSettings = createSelector(
    [soundSettings, musicSettings, animationSettings],
    (soundEnabled, musicEnabled, animationEnabled) => ({
        soundEnabled,
        musicEnabled,
        animationEnabled
    })
);
