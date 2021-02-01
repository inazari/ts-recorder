import React from "react";
import {Weather} from "./Weather";
import {IWeatherProps} from "./types";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

function withWeatherProps<P extends IWeatherProps>(Component: React.ComponentType<P>){
    return (props: Omit<P, keyof IWeatherProps>) => {
        const temperature = 26;
        const scale = 'C'
        return <Component {...props as P} temperature={temperature} scale={scale} />
    };
}

export const WithWeather = withWeatherProps(Weather)
