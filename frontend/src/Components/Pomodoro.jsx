import React, { useEffect, useState } from "react";
import Countdown from "./Countdown";
import ringing from "../resources/ringing.mp3";
import { useLocation } from "react-router-dom";

const Pomodoro = () => {

  const [workTime, setWorkTime] = useState(25);
  const [restTime, setRestTime] = useState(5);
  const [isWorking, setIsWorking] = useState(true);
  const [toContinue, setToContinue] = useState(false);
  let buzzer = new Audio(ringing);

  function isWorkingCallBack() {
    buzzer.play();
    if (restTime) {
      console.log("callback");
      if (isWorking) {
        sendSessionTime();
      }
      setIsWorking(!isWorking);
      setToContinue(true);
    }
  }

  const sendSessionTime = async () => {
    try {
      const res = await fetch(`http://10.10.11.29:8000/add_session_time/`, {
        method: "POST",
        headers: { "authorization": `token ${token}`, "Content-Type": "application/json", },
        body: JSON.stringify({ "session_time": 25 })
      })

    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <div className="flex items-center justify-center">
        {console.log(isWorking, toContinue)}
        <Countdown
          time={isWorking ? workTime : restTime}
          statusChange={isWorkingCallBack}
          toContinue={toContinue}
          isWorking={isWorking}
        />
      </div>
    </>
  );
};

export default Pomodoro;
