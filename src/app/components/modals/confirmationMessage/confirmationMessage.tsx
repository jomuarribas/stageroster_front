'use client';
import styles from './confirmationMessage.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  message: string;
}

const ConfirmationMessage: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={styles.confirmationContainer}>
        <div className={`${styles.confirmationMessage} ${styles.visible}`}>
          <div>
            <span className="material-symbols-outlined">help</span>
          </div>
          <div>
            <p>{message}</p>
            <div className={styles.buttonsModal}>
              <button className="emptyButton" onClick={onConfirm}>
                Si
              </button>
              <button className="emptyButton" onClick={onClose}>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationMessage;
