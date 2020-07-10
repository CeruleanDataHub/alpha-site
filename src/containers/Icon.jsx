import React from "react";
import styled from 'styled-components';
import temperature from './assets/icons/temperature.svg';
import humidity from './assets/icons/humidity.svg';
import pressure from './assets/icons/pressure.svg';

export const ICONS = {
    temperature,
    humidity,
    pressure
};

const Image = styled.img`
    height: 2em;
    float: left;
`;

export default class Icon extends React.Component {
    render() {
        return (
            <Image src={ this.props.type } />
        );
    }
}
