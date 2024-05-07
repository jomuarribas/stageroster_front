// @ts-nocheck
'use client';
import { useApi } from '@/app/hooks/useApi';
import styles from './page.module.css';
import { useUser } from '@/app/providers/userProvider';
import { useRef } from 'react';

export default function Contact() {
  const formRef = useRef(null);
  const { apiFetch } = useApi();
  const { user } = useUser();

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const route = `users/contact/${user._id}`;
    const form = {
      subject: e.currentTarget[0].value,
      message: e.currentTarget[1].value,
    };
    try {
      const fetch = await apiFetch(true, 'POST', route, form, null);
      if (fetch.message) {
        formRef.current.reset();
      }
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <main className={styles.contact}>
      <h2>Contacto</h2>
      <p>¿En qué podemos ayudarte?</p>
      <form ref={formRef} onSubmit={handleContact}>
        <p>
          De: {user.name} {user.surnames}
        </p>
        <label>
          Asunto:
          <input type="text" />
        </label>
        <label>
          Mensaje:
          <textarea />
        </label>
        <button className="button" type="submit">
          Enviar
        </button>
      </form>
    </main>
  );
}
