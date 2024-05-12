'use client';
import Image from 'next/image';
import styles from './PrincipalSection.module.css';

export default function PrincipalSection() {
  return (
    <section className={styles.principalSection}>
      <div>
        <div>
          <h3>Organiza en grupo los eventos de tu banda.</h3>
        </div>
        <div>
          <Image
            src="/assets/screenshots/Screenshot01.webp"
            alt="Logo"
            width={250}
            height={450}
            priority
          />
        </div>
      </div>
    </section>
  );
}
