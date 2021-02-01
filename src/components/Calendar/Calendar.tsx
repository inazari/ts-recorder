import React, {useEffect} from 'react';
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../redux/store";
import {selectUserEventsArray, loadUserEvent} from "../../redux/user-events";
import * as events from "events";

const mapState = (state: RootState) => ({
    events: selectUserEventsArray(state)
})

const mapDispatch = {
    loadUserEvent
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

interface Props extends PropsFromRedux {}

const groupEventsByDay = (events)

const Calendar:React.FC<Props> = ({events, loadUserEvent}) => {
    useEffect(()=>{
        loadUserEvent();
    }, [])
    return (
        <div>
            calendar
        </div>
    );
};

export default connector(Calendar);
