// @ts-nocheck
'use client';
import Image from 'next/image';
import styles from './Header.module.css';
import Link from 'next/link';
import Nav from '../Nav/Nav';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/providers/userProvider';

export default function Header() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { events, user } = useUser();

  useEffect(() => {
    const newPendingEvents = events.filter(
      (event) =>
        event.status === 'pending' &&
        event.title === 'Grupal' &&
        !event.acceptedBy.some((acceptedUser) => acceptedUser._id === user._id),
    );

    setPendingEvents(newPendingEvents);
  }, [events, user]);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const closeSession = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut();
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const onScroll = () => {
      if (isOpen) {
        handleClose();
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.spaceHeader}></div>
      <Nav isOpen={isOpen} onClose={handleClose} />
      <header className={styles.headerH}>
        <div className={styles.header}>
          <div>
            <Link href="./home">
              <p>Home</p>
              <span className="material-symbols-outlined">home</span>
            </Link>
            {pendingEvents.length > 0 && (
              <div className={styles.pendingEventsNumber}>
                <p>{pendingEvents.length}</p>
                <p>EP</p>
              </div>
            )}
          </div>
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
          <div>
            <Link href="./groups">
              <p>Grupos</p>
            </Link>
            <Link href="./calendary">
              <p>Calendario</p>
            </Link>
            <Link href="./user">
              <p>Usuario</p>
            </Link>
            <Link href="./contact">
              <p>Contacto</p>
            </Link>
            <Link href="./login" onClick={closeSession}>
              <span
                className={`material-symbols-outlined ${styles.logoutIcon}`}
              >
                logout
              </span>
            </Link>
            <span className="material-symbols-outlined" onClick={handleOpen}>
              menu
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
