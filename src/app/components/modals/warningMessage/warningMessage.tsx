'use client';
import { useAlert } from '@/app/providers/AlertContext';
import styles from './warningMessage.module.css';

export default function WarningMessage() {
  const { warningMessage, setWarningMessage } = useAlert();

  const closeModal = () => {
    setWarningMessage('');
  };

  return (
    <>
      {warningMessage && (
        <div className={styles.warningContainer}>
          <div className={`${styles.warningMessage} ${styles.visible}`}>
            <div>
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
              <p>{warningMessage}</p>
              <button className="emptyButton" onClick={closeModal}>
                cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
