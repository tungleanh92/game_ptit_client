/* eslint-disable prefer-const */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";

export const Timer = forwardRef(({ state, onExpireTime, name }: any, ref: any) => {
    const [minutes, setMinutes] = useState(10);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (!state) {
                return
            }
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    onExpireTime()
                    clearInterval(myInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
            if (seconds >= 60) {
                setSeconds(seconds - 60);
                setMinutes(minutes + 1);
            }
        }, 1000);
        return () => {
            clearInterval(myInterval);
        };
    });

    useImperativeHandle(ref, () => ({
        addSeconds() {
            setSeconds(seconds + 5);
        }
    }));
    // useEffect(() => {
    //     // eslint-disable-next-line react/prop-types
    //     if (state.resume == 1) {
    //         resume()
    //         return
    //     }
    //     // eslint-disable-next-line react/prop-types
    //     if (state.pause == 1) {
    //         pause()
    //         return
    //     }
    // }, [state])
    return (
        <div className="actual-timer">
            {name}:<span> {minutes < 10 ? `0${minutes}` : minutes}</span>:<span>{seconds}</span>
        </div>
    )
})