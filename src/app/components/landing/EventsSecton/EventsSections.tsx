import Image from 'next/image';
import styles from './EventsSection.module.css';

export default function EventsSection() {
  return (
    <section className={styles.eventsSection}>
      <div>
        <div>
          <h3>¡Crea eventos y espera su aceptación!</h3>
          <p>
            Cualquier miembro de la banda puede crear un evento para el grupo.
            Automaticamente se quedará como evento pendiende.
          </p>
          <p>
            Cada miembro del grupo deberá de aceptarlo según su disponibilidad
          </p>
          <p>
            Una vez que todos los miembros hayan aceptado el evento, se
            confirmará y se añadirá al calendario de eventos de la banda y
            pasará a ser evento confirmado.
          </p>
        </div>
        <div>
          <Image
            src="/assets/screenshots/Screenshot02.webp"
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
