import { useMemo } from "react";
import { ActionCreatorsMapObject, bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootStore } from "./types";

export const useAppDispatch = useDispatch<AppDispatch>;
export const useStateSelector: TypedUseSelectorHook<RootStore> = useSelector;

export const useActionCreators = (actions: ActionCreatorsMapObject) => {
    const dispatch = useAppDispatch();

    return useMemo(() => bindActionCreators(actions, dispatch), []);
};
