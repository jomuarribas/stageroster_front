'use client';
import Link from 'next/link';
import styles from './Nav_l.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Nav_l() {
  const router = useRouter();
  return (
    <nav className={styles.nav_l}>
      <div>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
        <h1>Stage Roster</h1>
      </div>
      <ul>
        <li>
          <Link href="/register">Registrarse</Link>
        </li>
        <li>
          <input
            type="button"
            value="Iniciar sesión"
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              router.push('/login');
            }}
          />
        </li>
      </ul>
    </nav>
  );
}
