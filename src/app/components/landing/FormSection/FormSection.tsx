// @ts-nocheck
'use client';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './FormSection.module.css';
import { useRef } from 'react';
import { useApi } from '@/app/hooks/useApi';

export default function FormSection() {
  const recaptcha = useRef();
  const formRef = useRef(null);
  const { apiFetch } = useApi();

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      return;
    }
    const route = `users/contact`;
    const form = {
      name: e.currentTarget[0].value,
      email: e.currentTarget[1].value,
      message: e.currentTarget[2].value,
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
    <section className={styles.formSection}>
      <div>
        <h3>Contacto:</h3>
        <p>
          Si tienes alguna duda, sugerencia o simplemente quieres ponerte en
          contacto con nosotros, rellena el siguiente formulario y te
          contestaremos lo antes posible.
        </p>
        <form ref={formRef} onSubmit={handleForm}>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="message">Mensaje:</label>
          <textarea id="message" name="message" required></textarea>
          <ReCAPTCHA
            className={styles.reCaptcha}
            sitekey="6LeJUMspAAAAAEG_ftXLvDNRDpwZ_E4W_c9Y1iOB"
            ref={recaptcha}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </section>
  );
}
