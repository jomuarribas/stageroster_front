'use client';
import { useAlert } from '@/app/providers/AlertContext';
import styles from './errorMessage.module.css';

export default function ErrorMessage() {
  const { errorMessage, setErrorMessage } = useAlert();

  const closeModal = () => {
    setErrorMessage('');
  };

  return (
    <>
      {errorMessage && (
        <div className={styles.errorContainer}>
          <div className={`${styles.errorMessage} ${styles.visible}`}>
            <div>
              <span className="material-symbols-outlined">cancel</span>
            </div>
            <div>
              <p>{errorMessage}</p>
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
