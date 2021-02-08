import React, {useEffect, useRef, useState} from 'react';
import style from "./Calendar.module.css";

import {useDispatch} from "react-redux";
import {createDateKey} from "../../lib/utils";
import {IUserEvent} from "../../store/userEvent/userEventsSlice";
import {deleteUserEvent, updateUserEvent} from "../../store/userEvent/userEvents.utils";

interface Props {
    event: IUserEvent
}

const EventItem: React.FC<Props> = ({event}) => {
    const dispatch = useDispatch()
    const [editableTitle, setEditableTitle] = useState(false)
    const [title, setTitle] = useState<string>('')
    const handleDeleteClick = () => {
        dispatch(deleteUserEvent({id: event.id}))
    }

    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editableTitle) {
            setTitle(event.title)
            titleRef.current?.focus()
        }
    }, [editableTitle])


    const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    }

    return <div>
        <div style={{backgroundColor: 'gray', display: 'unset', color: 'white'}}>
            {editableTitle ?
                <input ref={titleRef}
                       type='text'
                       onBlur={() => {
                           setEditableTitle(false)
                           if (event.title !== title) {
                               dispatch(updateUserEvent({...event, title}))
                           }
                       }}
                       onChange={handleTitleChange}
                       value={title}
                /> :
                <span onClick={() => {
                    setEditableTitle(!editableTitle)
                }}>title: {event.title}</span>
            }
        </div>
        <span> {createDateKey(new Date(event.dateStart))} - {createDateKey(new Date(event.dateEnd))}</span>
        <button onClick={handleDeleteClick} className={style['btn-remove']}>remove</button>
    </div>
};

export default EventItem;
