import styles from './GroupsSection.module.css';

export default function GroupsSection() {
  return (
    <section className={styles.groupsSection}>
      <div>
        <h3>¡El poder de los grupos!</h3>
        <h4>Todos se entrelazan a la hora de organizar un evento.</h4>
        <p>
          Cuando creas un evento la aplicación realiza la busqueda de
          disponibilidad tanto dentro de tus grupos como dentro de los grupos de
          tus compañeros por lo que si un compañero tiene un evento con otro de
          sus grupos la aplicación te dará el aviso.
        </p>
        <p>
          ¡DESPREOCUPATE! Stage Roster hará todo el trabajo por ti. La
          disponibilidad tuya y de tus compañeros será cotejada por la
          aplicación antes de añadir un evento.
        </p>
      </div>
    </section>
  );
}
