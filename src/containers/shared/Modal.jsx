import React from "react";
import StyledModal from "styled-react-modal";
import PropTypes from "prop-types";

const ModalContainer = StyledModal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
    align-items: center;
`;

const Modal = ({ isVisible, handlePopupClose, children }) => (
    <>
        {isVisible && (
            <ModalContainer isOpen={true} onBackgroundClick={handlePopupClose}>
                {children}
            </ModalContainer>
        )}
    </>
);

Modal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    handlePopupClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;
