import React, {useEffect} from 'react';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../redux/store";
import {selectUserEventsArray, loadUserEvent, UserEvent} from "../../redux/user-events";
import {createDateKey} from "../../lib/utils";
import style from "./Calendar.module.css"
import EventItem from "./EventItem";

const mapState = (state: RootState) => ({
    events: selectUserEventsArray(state)
})

const mapDispatch = {
    loadUserEvent
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

interface Props extends PropsFromRedux {}

const groupEventsByDay = (events: UserEvent[]) => {
    const groups: Record<string, UserEvent[]> = {};

    const addToGroup = (dateKey: string, event: UserEvent) => {
        if (groups[dateKey] === undefined) {
            groups[dateKey] = []
        }
        groups[dateKey].push(event);
    }

    events.forEach((event) => {
        const dateStartKey = createDateKey(new Date(event.dateStart))
        const dateEndKey = createDateKey(new Date(event.dateEnd))

        addToGroup(dateStartKey, event)
        if (dateEndKey !== dateStartKey) {
            addToGroup(dateEndKey, event)
        }

    })

    return groups
}

const Calendar: React.FC<Props> = ({events, loadUserEvent}) => {
    useEffect(() => {
        loadUserEvent();
    }, [])

    let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
    let sortedGroupKeys: string[] | undefined;

    if (events.length) {
        groupedEvents = groupEventsByDay(events);
        sortedGroupKeys = Object.keys(groupedEvents).sort((date1, date2) => +new Date(date2) - +new Date(date1))
    }

    return (
        groupedEvents && sortedGroupKeys ? (
            <div className={style.component}>
                {sortedGroupKeys.map((dayKey, index) => {
                    const events = groupedEvents![dayKey];
                    const groupDate = new Date(dayKey);
                    const day = groupDate.getDate();
                    const month = groupDate.toLocaleString(undefined, {month: 'long'})

                    return (<div className={style.box} key={index}>
                        <div>
                            <span>{day} {month}</span>
                        </div>
                        <div>
                            {events.map((event) => {
                                return <EventItem key={`event_${event.id}`} event={event} />
                            })}
                        </div>

                    </div>)

                })}
            </div>
        ) : <span>loading...</span>
    );
};

export default connector(Calendar);
