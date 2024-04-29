'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext({
  errorMessage: '',
  setErrorMessage: (message: string) => {},
  successMessage: '',
  setSuccessMessage: (message: string) => {},
  warningMessage: '',
  setWarningMessage: (message: string) => {},
});

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  return (
    <AlertContext.Provider
      value={{
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        warningMessage,
        setWarningMessage,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
