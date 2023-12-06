import React, { useState, useContext, useEffect } from "react";
import { useTimer } from "react-timer-hook";

export const Timer = ({
  state,
  onExpireTime,
  name,
  style,
  styleWrapper,
}: {
  state: any;
  onExpireTime: any;
  name: any;
  style?: React.CSSProperties;
  styleWrapper?: React.CSSProperties;
}) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600);
  const { seconds, minutes, pause, resume } = useTimer({
    autoStart: false,
    expiryTimestamp: time,
    onExpire: () => {
      onExpireTime();
    },
  });
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (state.resume == 1) {
      resume();
      return;
    }
    // eslint-disable-next-line react/prop-types
    if (state.pause == 1) {
      pause();
      return;
    }
  }, [state]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...styleWrapper,
      }}
    >
      {name}
      <div className="actual-timer" style={style}>
        <span> {minutes < 10 ? `0${minutes}` : minutes}</span>:
        <span>{seconds}</span>
      </div>
    </div>
  );
};
