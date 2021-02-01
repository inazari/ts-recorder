import React, {FC} from "react";
import {IWeatherProps} from "./types";

interface IWithWeatherProps {
    children(props: IWeatherProps): JSX.Element
}

export const WithWeatherPropsChildren: FC<IWithWeatherProps> = ({children}) => {
    const props: IWeatherProps = {
        temperature: 73,
        scale: 'F'
    }

    return children(props)
}
