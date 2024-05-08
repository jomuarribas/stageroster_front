'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './nav.module.css';
import { FC } from 'react';

interface NavProps {
  isOpen: boolean;
  onClose: () => void;
}
const Nav: FC<NavProps> = ({ isOpen, onClose }) => {
  const closeSession = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    signOut({ callbackUrl: 'https://stageroster.netlify.app/login' });
    localStorage.removeItem('token');
  };
  return (
    <nav className={`${styles.nav} ${!isOpen ? styles.closeNav : ''}`}>
      <div>
        <Link href="/home" onClick={onClose}>
          Home
          <span className="material-symbols-outlined">home</span>
        </Link>
        <Link href="/groups" onClick={onClose}>
          Mis grupos
          <span className="material-symbols-outlined">groups</span>
        </Link>
        <Link href="/calendary" onClick={onClose}>
          Mi calendario
          <span className="material-symbols-outlined">calendar_month</span>
        </Link>
        <Link href="/user" onClick={onClose}>
          Mi cuenta
          <span className="material-symbols-outlined">person</span>
        </Link>
        <Link href="/contact" onClick={onClose}>
          Contacto
          <span className="material-symbols-outlined">mail</span>
        </Link>
      </div>
      <div>
        <Link href="/login" onClick={closeSession}>
          Cerrar sesión
          <span className="material-symbols-outlined">logout</span>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
