'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './page.module.css';
import './calendary.css';
import esLocale from '@fullcalendar/core/locales/es';
import { useRef, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { useUser } from '@/app/providers/userProvider';
import { set } from 'react-hook-form';

export default function Calendary() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendary, setCalendary] = useState(false);
  const formRef = useRef(null);
  const { user, groups, events, setEvents } = useUser();
  const { apiFetch } = useApi();

  const toogleCalendary = () => {
    setCalendary(!calendary);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  const handleEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const route = `users/addmydates/${user._id}`;
      const event = {
        date: e.currentTarget.date.value,
        extendedProps: {
          eventTitle: e.currentTarget.eventTitle.value,
          description: e.currentTarget.description.value,
          location: e.currentTarget.location.value,
        },
      };
      const fetch = await apiFetch(true, 'POST', route, event, null);
      if (fetch.message) {
        setEvents((currentEvents) => [...currentEvents, fetch.event]);
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Error al añadir evento personal:', error);
    }
  };
  const deleteGroupEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.target.parentElement.children[0].innerText;
    const match = name.match(/\(([^)]+)\)/);
    const date = name.replace(/\([^)]*\)/g, '').trim();
    const reverseDate = {
      date: date.split('-').reverse().join('-'),
    };
    await apiFetch(
      true,
      'DELETE',
      `groups/deleteevent/${match[1]}`,
      reverseDate,
      null,
    );
    setEvents(events.filter((event) => event.date !== reverseDate.date));
  };

  const deletePersonalEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const date = e.target.parentElement.children[0].innerText;
    const reverseDate = {
      date: date.split('-').reverse().join('-'),
    };
    await apiFetch(
      true,
      'DELETE',
      `users/deletemydate/${user._id}`,
      reverseDate,
      null,
    );
    setEvents(events.filter((event) => event.date !== reverseDate.date));
  };

  return (
    <main className={styles.calendary}>
      <div>
        <h2 className={styles.calendaryTitle}>Tu agenda</h2>
        <div className={styles.toogleCalendary}>
          <p onClick={toogleCalendary}>
            <span className="material-symbols-outlined">
              {!calendary ? 'arrow_drop_down' : 'arrow_drop_up'}
            </span>
            {!calendary ? 'MOSTRAR CALENDARIO' : 'OCULTAR CALENDARIO'}
            <span className="material-symbols-outlined">
              {!calendary ? 'arrow_drop_down' : 'arrow_drop_up'}
            </span>
          </p>
        </div>
        <div
          className={
            !calendary ? styles.toogleCalendaryOff : styles.calendarContainer
          }
        >
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            locale={esLocale}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
            }}
            weekends={true}
            events={events.filter(
              (event) =>
                (event.title === 'Grupal' && event.status === 'confirmed') ||
                event.title === 'Personal',
            )}
            eventClick={handleEventClick}
          />
        </div>
        {selectedEvent && (
          <div className="event-details">
            <h3>
              -{' '}
              {!selectedEvent.extendedProps.groupName
                ? 'Evento Personal'
                : selectedEvent.extendedProps.groupName}{' '}
              -
            </h3>
            <h3>{selectedEvent.extendedProps.eventTitle}</h3>
            <p>({selectedEvent.startStr})</p>
            <p>Ubicacion: {selectedEvent.extendedProps.location}</p>
            <p>{selectedEvent.extendedProps.description}</p>
            <button className="emptyButton" onClick={closeDetails}>
              Cerrar
            </button>{' '}
          </div>
        )}

        <div className={styles.grupalDates}>
          <h3>Eventos Grupales</h3>
          {events.filter(
            (event) => event.status === 'confirmed' && event.title === 'Grupal',
          ).length > 0 ? (
            events
              .filter(
                (event) =>
                  event.status === 'confirmed' && event.title === 'Grupal',
              )
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event, index) => (
                <div key={index}>
                  <p>
                    {event.date.split('-').reverse().join('-')} (
                    {event.extendedProps.groupName})
                  </p>
                  <p>
                    {event.extendedProps.eventTitle} en{' '}
                    {event.extendedProps.location}
                  </p>
                  <button onClick={deleteGroupEvent}>Eliminar</button>
                </div>
              ))
          ) : (
            <div>
              <p>No hay eventos grupales</p>
            </div>
          )}
        </div>

        <div className={styles.personalDates}>
          <h3>Eventos Personales</h3>
          {events.filter((event) => event.title === 'Personal').length > 0 ? (
            events
              .filter((event) => event.title === 'Personal')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event, index) => (
                <div key={index}>
                  <p>{event.date.split('-').reverse().join('-')}</p>
                  <p>
                    {event.extendedProps.eventTitle} en{' '}
                    {event.extendedProps.location}
                  </p>
                  <button onClick={deletePersonalEvent}>Eliminar</button>
                </div>
              ))
          ) : (
            <div>
              <p>No hay eventos personales</p>
            </div>
          )}
        </div>
        <div className={styles.dates}>
          <div>
            <div className={styles.description}>
              <p>
                Puedes dar de alta fechas de caracter personal para ocupar tu
                disponibilidad de cara a un evento grupal nuevo.
              </p>
              <p>
                La información de caracter personal será privada, lo que
                significa que simplemente aparecerá en el calendario global como
                ocupada, el resto de información será accesible solo para ti
                desde esta sección.
              </p>
            </div>
            <h3>Eventos personales</h3>
            <form ref={formRef} onSubmit={handleEvent}>
              <label htmlFor="eventTitle">Nombre del evento</label>
              <input
                type="text"
                id="eventTitle"
                name="eventTitle"
                placeholder="Nombre"
                required
              />
              <label htmlFor="description">Descripción</label>
              <input
                type="text"
                id="description"
                placeholder="Breve descripción"
                name="description"
                required
              />
              <label htmlFor="location">Ubicación</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Donde se llevará a cabo el evento"
                required
              />
              <label htmlFor="date">Fecha</label>
              <input type="date" id="date" name="date" required />
              <button type="submit">Ocupar fecha</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
