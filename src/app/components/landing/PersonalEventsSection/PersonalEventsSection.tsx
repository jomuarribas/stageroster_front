import styles from './PersonalEventsSection.module.css';

export default function PersonalEventsSection() {
  return (
    <section className={styles.personalEventsSection}>
      <div>
        <h3>Eventos personales para tener todo cubierto...</h3>
        <p>
          Para tener toda la disponibilidad completa puedes añadir tus propios
          eventos personales.
        </p>
        <p>
          En el calendario de aparecerán tanto los eventos de todos tus grupos
          como tus propios eventos personales.
        </p>
        <p>
          ¡No te preocupes! Entendemos que tus propios eventos personales deben
          de ser privados así que aunque se muesten en tu calendario no se
          mostrarán al resto de los integrantes pero si serán considerados a la
          hora de añadir un evento grupal nuevo.
        </p>
        <p>
          Como ya hemos dicho queremos tener toda la disponibilidad cubierta!!
        </p>
      </div>
    </section>
  );
}
