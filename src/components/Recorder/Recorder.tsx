import React, {useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import style from './recorder.module.css'
import {addZero} from "../../lib/utils";
import {IUserEvent} from "../../store/userEvent/userEventsSlice"
import {start, stop} from "../../store/recorder/recorderSlice"
import {selectDateStart} from "../../store/recorder/recorderSelectors";
import {createUserEvent} from "../../store/userEvent/userEvents.utils";


const Recorder = () => {
    const dispatch = useDispatch()
    const dateStart = useSelector(selectDateStart)
    const started = dateStart !== '';
    const [count, setCount] = useState<number>(0);
    let interval = useRef<number>(0);

    useEffect(() => {
        return () => {
            window.clearInterval(interval.current)
        };
    }, [])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (started) {
            dispatch(createUserEvent())
            dispatch(stop())
            setCount(0)
            window.clearInterval(interval.current)
        } else {
            dispatch(start())
            interval.current = window.setInterval(() => {
                setCount(count => count + 1)
            }, 1000)
        }
    }

    const diffSeconds = started ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000) : 0;
    const hours = diffSeconds ? Math.floor(diffSeconds / 60 / 60) : 0;
    const minutes = diffSeconds ? Math.floor(diffSeconds / 60) : 0;
    const seconds = diffSeconds - minutes * 60

    return (
        <div className={style.component}>
            <button onClick={handleClick} className={cx([style['record-btn']], {[style.active]: started})}>record
            </button>
            <div>{addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}</div>
        </div>
    );
};

export default Recorder;
