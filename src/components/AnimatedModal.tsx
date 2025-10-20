import React from 'react';
import { Dialog, DialogProps, Fade } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedModalProps extends DialogProps {
  children: React.ReactNode;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  open,
  onClose,
  ...props
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: 400,
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        },
      }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

