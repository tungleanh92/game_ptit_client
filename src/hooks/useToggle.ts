import {useCallback, useState} from "react";

export const useToggle = (initialState: boolean = false): [boolean, any] => {
    const [state, setState] = useState(initialState);

    const toggle = useCallback((stateNew: any) => {
        setState((prevState) => {
            if (typeof stateNew === 'boolean') {
                return stateNew;
            } else {
                return !prevState;
            }
        })
    }, []);

    return [state, toggle];
}
