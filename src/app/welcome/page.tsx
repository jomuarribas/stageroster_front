'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useApi } from '../hooks/useApi';

export default function Welcome() {
  const { apiFetch } = useApi();
  const router = useRouter();

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const route = `users/verification`;
    const dataForm = {
      email: (document.getElementById('email') as HTMLInputElement).value,
      secretKey: (document.getElementById('secretKey') as HTMLInputElement).value,
    };
    try {
      await apiFetch(true, 'POST', route, dataForm, '/login');
    } catch (error) {
      console.error('Error al verificar el usuario', error);
    }
  };

  return (
    <section className={styles.welcome}>
      <div className={styles.logo}>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
        <h1>Stage Roster</h1>
      </div>
      <form className={styles.welcomeText} onSubmit={handleVerification}>
        <h2>Bienvenid@ a Stage Roster</h2>
        <p>
          Escribe a continuación el código de verificación que te hemos enviado
          al mail (si no te llega reguerda mirar en la bandeja de spam):
        </p>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="secretKey">Número secreto:</label>
        <input type="number" id="secretKey" name="SecretKey" required />
        <p>
          Cuando verifiques tu cuenta ya podrás entrar a la plataforma y empezar
          a disfrutar de todas las funcionalidades que te ofrecemos.
        </p>
        <button className="emptyButton">
          Verificar
        </button>
      </form>
    </section>
  );
}
