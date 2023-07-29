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
