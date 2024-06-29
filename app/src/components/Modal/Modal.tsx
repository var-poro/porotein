import React from 'react';
import styles from './Modal.module.scss';
import { IoCloseSharp } from 'react-icons/io5';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose}>
            <IoCloseSharp />
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Annuler
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
