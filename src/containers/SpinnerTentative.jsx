import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const SpinnerContainer = styled.div`
    margin: 1em;
    width: 60px;
    height: 60px;
    background-color: lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
`;

const Spinner = styled.div`
    width: 32px;
    height: 32px;
    margin: 8px;
    border: 4px solid #fff;
    border-radius: 50%;
    animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;

    @keyframes spinner {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
`;

const SpinnerTentative = ({ condition, children }) => {
    return (
        <>
            {condition ? (
                children
            ) : (
                <SpinnerContainer>
                    <Spinner />
                </SpinnerContainer>
            )}
        </>
    );
};

SpinnerTentative.propTypes = {
    condition: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default SpinnerTentative;
