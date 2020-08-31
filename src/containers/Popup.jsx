import React from "react";
import Modal from "styled-react-modal";
import PropTypes from "prop-types";

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

const Popup = ({ isVisible, handlePopupClose, children }) => (
    <>
        {isVisible && (
            <PopupModal isOpen={true} onBackgroundClick={handlePopupClose}>
                {children}
            </PopupModal>
        )}
    </>
);

Popup.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    handlePopupClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Popup;
