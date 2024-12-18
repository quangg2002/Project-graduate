import React from 'react';
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: string
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children, width }) => {
  return (
    <Transition in={open} timeout={400}>
      {(state: string) => (
        <Modal
          keepMounted
          open={!['exited', 'exiting'].includes(state)}
          onClose={onClose}
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: 'none',
                transition: `opacity 400ms, backdrop-filter 400ms`,
                ...{
                  entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                  entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                }[state],
              },
            },
          }}
          sx={[
            state === 'exited'
              ? { visibility: 'hidden' }
              : { visibility: 'visible' },
          ]}
        >
          <ModalDialog
            sx={{
              width: width,
              maxWidth: '800px',
              minHeight: '200px',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(0%, 100px)',
              opacity: 0,
              transition: `opacity 300ms, transform 300ms`,
              ...{
                entering: { opacity: 1, transform: 'translate(-50%, -50%)' },
                entered: { opacity: 1, transform: 'translate(-50%, -50%)' },
              }[state],
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            {children}
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
};

export default CustomModal;
