'use client';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAlert } from '../providers/AlertContext';
import { useRouter } from 'next/navigation';

interface formDataSend {
  username: string;
  password: string;
}

export default function Login() {
  const { setErrorMessage } = useAlert();
  const router = useRouter();
  const { data: session, status } = useSession();

  const token = session?.user.token;
  if (status === 'authenticated' && token) {
    localStorage.setItem('token', token);
  }

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<formDataSend>();

  const submit = async (data: formDataSend) => {
    const responseNextAuth = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (!responseNextAuth?.error) {
      router.push('/home');
      return;
    }
    setErrorMessage(responseNextAuth.error);
  };

  return (
    <main className={styles.login}>
      <div className={styles.loginDiv}>
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
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <label htmlFor="username">Nombre de usuario*</label>
            <input
              type="text"
              id="username"
              {...register('username', {
                required: 'Debes poner un nombre de usuario',
              })}
              className={formErrors.username ? styles.inputFormError : ''}
            />
            {formErrors.username && <p>{formErrors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="password">Contraseña*</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Debes poner una contraseña',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/,
                  message: '8 Caracteres, 1 mayúscula y 1 minúscula',
                },
              })}
              className={formErrors.password ? styles.inputFormError : ''}
            />
            {formErrors.password && <p>{formErrors.password.message}</p>}
          </div>
          <button className={`emptyButton ${styles.buttonLogin}`} type="submit">
            Entrar
          </button>
        </form>
        <div className={styles.register}>
          <div className={styles.register}>
            <p>
              No estás registrado?
              <Link href="/register">
                <span> Crea una cuenta</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.privacyPolicy}>
        <Link href="/privacypolicy">Política de privacidad</Link>
      </div>
    </main>
  );
}
