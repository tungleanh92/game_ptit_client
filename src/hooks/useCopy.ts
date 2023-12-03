import { useCallback, useEffect, useRef, useState } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export function useCopy(string: string, copyTimeout: number = 1000) {
    const [isCopied, setIsCopied] = useState(false);
    const timeout = useRef<Timeout | null>(null);

    // clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current)
            }
        }
    }, []);

    const copy = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }

        navigator.clipboard.writeText(string);
        setIsCopied(true);
        timeout.current = setTimeout(() => {
            setIsCopied(false);
        }, copyTimeout);
    }, [timeout, string]);

    return { copy, isCopied };
}