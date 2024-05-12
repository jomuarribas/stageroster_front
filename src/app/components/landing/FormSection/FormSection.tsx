// @ts-nocheck
'use client';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './FormSection.module.css';
import { useRef } from 'react';

export default function FormSection() {
  const recaptcha = useRef();

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      return;
    }
    const form = e.currentTarget;
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
        <form onSubmit={handleForm}>
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
