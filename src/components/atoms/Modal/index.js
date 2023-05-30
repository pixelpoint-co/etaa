import {
  useState,
} from 'react';
import ReactModal from 'react-modal';
import styled, {
  createGlobalStyle,
} from 'styled-components';

// import Flex from '../Flex';

ReactModal.setAppElement('#root'); // Set the root element where your app is rendered
ReactModal.defaultStyles.overlay = {
  ...ReactModal.defaultStyles.overlay,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(108, 108, 108, 0.85)',
};
ReactModal.defaultStyles.content = {
  ...ReactModal.defaultStyles.content,
  inset: 'unset',
  border: 'none',
  padding: '0px',
  background: 'none',
};

// const GlobalStyle = createGlobalStyle`  // all important since it is override default styles
//   .ReactModal__Overlay {
//     z-index: 2 !important;
//     display: flex !important;
//     justify-content: center !important;
//     align-items: center !important;
//   }
//   .ReactModal__Content {
//     inset: unset !important;
//   }
// `;

const Modal = (props) => {
  const {
    isOpen,
    onClose,
    children,
    others,
  } = props;
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      {/* <GlobalStyle /> */}
      {children}
    </ReactModal>
  );
};

export default Modal;
