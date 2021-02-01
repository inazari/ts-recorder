import React from 'react'
import {Weather} from "./Weather/Weather";
import {WithWeatherPropsChildren} from "./Weather/WithWeatherPropsChildren";
import {WithWeather} from "./Weather/WithWeather";

export const  WeatherWrapper = () => {
    return <>
        <WithWeather theme='yellow' />

        <WithWeatherPropsChildren>
            {(props => <Weather scale={props.scale} temperature={props.temperature} theme={'green'} />)}
        </WithWeatherPropsChildren>
    </>
}
