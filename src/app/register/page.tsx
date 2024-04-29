'use client';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useApi } from '../hooks/useApi';
import styles from './page.module.css';

type formDataSend = {
  username: string;
  name: string;
  surnames: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { apiFetch } = useApi();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm<formDataSend>();
  const password = watch('password', '');

  const submit = async (data: formDataSend) => {
    // const captchaValue = recaptcha.current.getValue()
    // if (!captchaValue) {
    //   return
    // }
    const { confirmPassword, ...formDataRest } = data;
    const route = 'users/register';
    const next = '/welcome';
    try {
      await apiFetch(false, 'POST', route, formDataRest, next);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className={styles.register}>
        <form className={styles.registerForm} onSubmit={handleSubmit(submit)}>
          <div className={styles.logo}>
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
            <h1>Stage Roster</h1>
            <h2>REGISTRO</h2>
          </div>
          <div>
            <label htmlFor="username">Nombre de usuario*</label>
            <input
              type="text"
              id="username"
              {...register('username', {
                required: 'Debes poner un nombre de usuario',
              })}
              className={formErrors.username ? styles.inputError : ''}
              placeholder='Ejemplo: "Juanito123"'
            />
            {formErrors.username && (
              <p className={styles.errors}>{formErrors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name">Nombre*</label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Debes poner un nombre',
              })}
              className={formErrors.name ? styles.inputError : ''}
              placeholder='Ejemplo: "Juanito"'
            />
            {formErrors.name && (
              <p className={styles.errors}>{formErrors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="surnames">Apellidos</label>
            <input
              type="text"
              id="surnames"
              {...register('surnames', {})}
              className={formErrors.surnames ? styles.inputError : ''}
              placeholder='Ejemplo: "Pérez López"'
            />
            {formErrors.surnames && (
              <p className={styles.errors}>{formErrors.surnames.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email">Correo electrónico*</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Debes poner un correo electrónico',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'El formato de email no es correcto',
                },
              })}
              className={formErrors.email ? styles.inputError : ''}
              placeholder='Ejemplo: "juanitoperez@email.com"'
            />
            {formErrors.email && (
              <p className={styles.errors}>{formErrors.email.message}</p>
            )}
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
              className={formErrors.password ? styles.inputError : ''}
              placeholder="********"
            />
            {formErrors.password && (
              <p className={styles.errors}>{formErrors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirma la contraseña*</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden',
              })}
              className={formErrors.confirmPassword ? styles.inputError : ''}
              placeholder="********"
            />
            {formErrors.confirmPassword && (
              <p className={styles.errors}>
                {formErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <button className="emptyButton" type="submit">
            Registrar
          </button>
          <Link href="/login">- volver a login -</Link>
        </form>
      </section>
    </>
  );
}
