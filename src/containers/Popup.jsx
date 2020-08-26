import React from "react";
import Modal from "styled-react-modal";
import PropTypes from "prop-types";

import ChartTabs from "./ChartTabs.jsx";

const PopupModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
    align-items: center;
`;

const Popup = ({ device, handlePopupClose }) => (
    <PopupModal isOpen={true} onBackgroundClick={handlePopupClose}>
        <ChartTabs device={device} />
    </PopupModal>
);

Popup.propTypes = {
    device: PropTypes.shape({
        external_id: PropTypes.string.isRequired,
    }).isRequired,
    handlePopupClose: PropTypes.func.isRequired,
};

export default Popup;
