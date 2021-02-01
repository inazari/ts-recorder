import React, {FC} from 'react'
import {IWeatherProps} from "./types";

interface Props extends IWeatherProps{
    theme: 'yellow' | 'green'
}

export const Weather: FC<Props> = ({temperature, scale, theme}) => {

    return <div style={{backgroundColor: `${theme}`}}>the temperature is {temperature} &deg;{scale} </div>
}
