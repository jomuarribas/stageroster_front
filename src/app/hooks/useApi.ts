import { useRouter } from 'next/navigation';
import { useAlert } from '../providers/AlertContext';
import { useState } from 'react';

export const useApi = () => {
  const router = useRouter();
  const { setSuccessMessage, setErrorMessage, setWarningMessage } = useAlert();
  const [loading, setLoading] = useState(false);

  const apiFetch = async (
    alert: boolean,
    method: string,
    route: string,
    formData: {} | FormData | null,
    next: string | null,
    headersContent: string = 'application/json'
  ) => {
    try {
      setLoading(true);
      const headers: { [key: string]: string } = {};
      let formDataToSend: {} | string | null = formData;

      if (formData !== null) {
        if (formData instanceof FormData) {
          formDataToSend = formData;
        } else if (headersContent === 'application/json') {
          headers['Content-Type'] = headersContent;
          formDataToSend = JSON.stringify(formData);
        }
      }

      if (localStorage.getItem('token')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      const requestOptions: RequestInit = {
        method: method,
        headers: headers
      };

      if (formDataToSend !== null) {
        (requestOptions as any).body = formDataToSend;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${route}`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setWarningMessage(data.warning);
        }
        return;
      }

      setLoading(false);
      if (alert) {
        setSuccessMessage(data.message);
      }
      if (next) {
        router.push(next);
      }
      return data;
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrorMessage('Hubo un error al realizar la solicitud.');
    }
  };

  return { apiFetch, loading };
};