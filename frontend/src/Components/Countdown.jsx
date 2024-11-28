
import React, { useEffect, useRef, useState } from "react";
// import "./countdown.css";

const Countdown = ({ time, statusChange, toContinue, isWorking }) => {

    console.log(time);
    const [start, setStart] = useState(false);
    const [pause, setPause] = useState(false);
    const displayRef = useRef(null);

    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [finalTime, setFinalTime] = useState(new Date().getTime());
    const [pausedTime, setPausedTime] = useState(new Date().getTime());

    useEffect(() => {
        handleReset();
        return () => {
            clearInterval(displayRef.current)
            handleReset();
            console.log('cleanup countdown')
        };
    }, [time]);

    useEffect(() => {
        console.log(toContinue)
        if (toContinue) {
            console.log('Continues')
            handleStart();
        }
    }, [isWorking])

    function handleStart() {
        console.log(time)
        setStart(true);
        const now = new Date();
        setCurrentTime(new Date().getTime())
        if (pause) {
            setFinalTime(now.getTime() + pausedTime.getTime())
        }
        else {
            now.setMinutes(now.getMinutes() + time)
            console.log(now.getTime())
            setFinalTime(now.getTime());
        }
        setPause(false);

        console.log(now.getMinutes())
        console.log("final time", finalTime);

        displayRef.current = setInterval(() => {
            setCurrentTime(new Date().getTime())
            console.log(currentTime)
        }, 1000);
    }

    function handlePause() {
        // setStart(false);
        setPause(true)
        setPausedTime(new Date(finalTime - currentTime))
        console.log("pause");
        clearInterval(displayRef.current);
    }

    function handleReset() {
        setStart(false);
        setPause(false);
        clearInterval(displayRef.current);
        setFinalTime(new Date().getTime());
        setCurrentTime(new Date().getTime())
    }



    const timeDisplay = () => {
        const timeInSec = new Date(finalTime - currentTime) / 1000 || 0;
        console.log(finalTime, currentTime)
        console.log(timeInSec)

        let minutes, seconds;
        if (!start && !pause) {
            console.log('time display ')
            minutes = time;
            seconds = 0;
        } else {
            minutes = Math.floor(timeInSec % 3600 / 60) || 0;
            seconds = Math.floor(timeInSec % 3600 % 60) || 0;
        }
        console.log(timeInSec)

        if (timeInSec <= 0 && start) {
            console.log("hi");
            handleReset();
            statusChange();
        }
        return `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
    };

    return (
        <div className="flex flex-col items-center">
            <span className="text-white text-[10vw] font-bold text-center md:p-7 p-2">
                {timeDisplay()}
            </span>
            <div className="text-[2vw] title text-white flex gap-[50px]">
                {!(start ^ pause) ? (
                    <button
                        className="py-2 w-[10vw] border rounded-lg bg-white text-counterBg text-center drop-shadow-md "
                        onClick={handleStart}
                    >
                        Start
                    </button>
                ) : (
                    <button
                        className="py-2 w-[10vw] border rounded-lg bg-white text-counterBg text-center "
                        onClick={handlePause}
                    >
                        Pause
                    </button>
                )}
                <button
                    className="py-2 w-[10vw] border rounded-lg bg-white text-counterBg text-center drop-shadow-md"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Countdown;
