'use client';
import { useEffect } from 'react';
import styles from './successMessage.module.css';
import { useAlert } from '@/app/providers/AlertContext';

export default function SuccessMessage() {
  const { successMessage, setSuccessMessage } = useAlert();

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [successMessage]);

  return (
    <>
      {successMessage && (
        <div className={`${styles.successMessage} ${styles.visible}`}>
          <div>
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
