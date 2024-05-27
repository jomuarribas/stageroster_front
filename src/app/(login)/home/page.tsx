// @ts-nocheck
'use client';
import { useUser } from '@/app/providers/userProvider';
import styles from './page.module.css';
import { useApi } from '@/app/hooks/useApi';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PendingEvents from '@/app/components/modals/pendingEvents/pendingEvents';

export default function Home() {
  const [disappearing, setDisappearing] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pendingEventsModalOpen, setPendingEventsModalOpen] = useState(false);
  const formRef = useRef(null);
  const { groups, user, events, setEvents } = useUser();
  const { apiFetch } = useApi();

  useEffect(() => {
    const hasPendingEvents = events.some(
      (event) =>
        event.status === 'pending' &&
        event.title === 'Grupal' &&
        !event.acceptedBy.some((acceptedUser) => acceptedUser._id === user._id),
    );

    setPendingEventsModalOpen(hasPendingEvents);
  }, [events, user]);

  const handleScroll = () => {
    setIsFlipped(null);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const route = `groups/addevent/${e.currentTarget.group.value}`;
    const event = {
      date: e.currentTarget.date.value,
      time: e.currentTarget.time.value,
      userId: user._id,
      extendedProps: {
        eventTitle: e.currentTarget.name.value,
        description: e.currentTarget.description.value,
        location: e.currentTarget.location.value,
        groupName: e.currentTarget.group.value,
      },
    };
    try {
      const fetch = await apiFetch(true, 'POST', route, event, null);
      if (fetch.message) {
        setEvents((currentEvents) => [...currentEvents, fetch.event]);
        formRef.current.reset();
        window.scrollTo(0, 0);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  const deleteGroupEvent = async (event) => {
    const name = event.extendedProps.groupName;
    const date = { date: event.date };
    const data = await apiFetch(
      true,
      'DELETE',
      `groups/deleteevent/${name}`,
      date,
      null,
    );
    if (data.message) {
      setIsFlipped(false);
      setEvents(events.filter((e) => e.date !== date.date));
      setDisappearing(null);
    }
  };

  const confirmGroupEvent = async (event) => {
    const data = {
      date: event.date,
      accept: true,
      userId: user._id,
    };
    const response = await apiFetch(
      true,
      'PUT',
      `groups/updateevent/${event.extendedProps.groupName}`,
      data,
      null,
    );

    if (response.status) {
      setEvents((currentEvents) => {
        return currentEvents.map((event) => {
          if (event.date === data.date) {
            return {
              ...event,
              status: response.status,
              acceptedBy: [...event.acceptedBy, user],
            };
          }
          return event;
        });
      });
    }
  };

  const rejectGroupEvent = async (event) => {
    const name = event.extendedProps.groupName;
    const data = {
      date: event.date,
      reject: true,
    };
    await apiFetch(true, 'PUT', `groups/updateevent/${name}`, data, null);
    setIsFlipped(false);
    setEvents((currentEvents) => {
      return currentEvents.map((event) => {
        if (event.date === data.date) {
          return {
            ...event,
            status: 'rejected',
          };
        }
        return event;
      });
    });
  };

  return (
    <>
      <PendingEvents
        isOpen={pendingEventsModalOpen}
        onClose={() => setPendingEventsModalOpen(false)}
      />
      <main className={styles.home}>
        <div>
          <h3>Crea un evento:</h3>
          <form ref={formRef} onSubmit={addEvent}>
            <label htmlFor="name" className={styles.selectForm}>
              ¿Con que grupo?
            </label>
            <select name="group" id="group">
              <option value="-">-</option>
              {groups.map((group) => (
                <option
                  key={group._id}
                  value={group.name}
                  name="group"
                  required
                >
                  {group.name}
                </option>
              ))}
            </select>
            <label htmlFor="name">Nombre del evento</label>
            <input
              type="text"
              id="name"
              name="name"
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
            <label htmlFor="time">Hora de comienzo</label>
            <input type="time" id="time" name="time" required />
            <button type="submit">Crear evento</button>
          </form>
          <div className={styles.description}>
            <h3>LISTAS</h3>
            <p>
              En las siguientes listas se muestran los eventos pendientes por
              confirmar o rechazar, los eventos que ya han sido confirmados por
              todos los miembros del grupo y los eventos que han sido
              rechazados.
            </p>
            <p>
              Cuando un evento es rechazado por una persona automaticamente
              queda rechazado al igual que si un evento se acepta por todos los
              miembros del grupo el evento pasa automaticamente a la lista de
              confirmados.
            </p>
            <strong>
              ¡HAZ CLICK EN CUALQUIER EVENTO PARA VER MÁS DETALLES O
              ELIMINARLO.!
            </strong>
          </div>
        </div>
        <div id="pendingEvents" className={styles.pendingEvents}></div>
        <div className={styles.grupalDates01}>
          <h3>Eventos pendientes</h3>
          {events.filter(
            (event) => event.status === 'pending' && event.title === 'Grupal',
          ).length > 0 ? (
            events
              .filter(
                (event) =>
                  event.status === 'pending' && event.title === 'Grupal',
              )
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event, index) => (
                <div key={index}>
                  <strong>
                    {event.date.split('-').reverse().join('-')} (
                    {event.extendedProps.groupName})
                  </strong>
                  <p className={styles.eventTime}>- Hora: {event.time} -</p>
                  <p>
                    {event.extendedProps.eventTitle} en{' '}
                    {event.extendedProps.location}
                  </p>
                  <div className={styles.pendingButtons}>
                    {!event.acceptedBy.some(
                      (acceptedUser) => acceptedUser._id === user._id,
                    ) && (
                      <>
                        <button
                          className="emptyButton"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteGroupEvent(event);
                          }}
                        >
                          Eliminar
                        </button>

                        <button
                          className="emptyButton"
                          onClick={(e) => {
                            e.preventDefault();
                            rejectGroupEvent(event);
                          }}
                        >
                          Rechazar
                        </button>

                        <button
                          className="emptyButton"
                          onClick={(e) => {
                            e.preventDefault();
                            confirmGroupEvent(event);
                          }}
                        >
                          Confirmar
                        </button>
                      </>
                    )}
                  </div>
                  <div className={styles.confirmedUser}>
                    <p>Usuarios que han confirmado:</p>
                    <div>
                      {event.acceptedBy.length > 0 ? (
                        event.acceptedBy.map((user, index) => (
                          <div key={index} className={styles.usernameImg}>
                            <Image
                              src={user.img ? user.img : '/assets/user.png'}
                              alt="Imagen de perfil"
                              width={100}
                              height={100}
                            />
                            <p>{user.username}</p>{' '}
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            color: 'brown',
                            fontSize: '13px',
                            marginBottom: '10px',
                          }}
                        >
                          - Ningún usuario ha confirmado aún -
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>- No hay eventos -</p>
          )}
        </div>

        <div className={styles.grupalDates02}>
          <h3>Eventos confirmados</h3>
          {events.filter((event) => event.status === 'confirmed').length > 0 ? (
            events
              .filter((event) => event.status === 'confirmed')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event, index) => (
                <div
                  className={`${styles.card} ${isFlipped === index ? styles.flipped : ''} ${disappearing === index ? styles.disappearing : ''}`}
                  onClick={() => setIsFlipped(index)}
                  key={index}
                >
                  <div className={styles.cardInner}>
                    <div
                      className={`${styles.cardFace} ${styles.cardFaceFront}`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <span className="material-symbols-outlined">
                        touch_app
                      </span>
                      <strong>
                        {event.date.split('-').reverse().join('-')}
                      </strong>
                      <strong>{event.extendedProps.groupName}</strong>
                      <p className={styles.eventTime}>
                        <span className="material-symbols-outlined">
                          schedule
                        </span>{' '}
                        {event.time}
                      </p>
                      <p>{event.extendedProps.eventTitle}</p>
                      <p> {event.extendedProps.location}</p>
                    </div>
                    <div className={styles.cardFaceBack}>
                      <button className={`emptyButton ${styles.detailButton}`}>
                        Detalles
                      </button>
                      <button
                        className="emptyButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          rejectGroupEvent(event);
                        }}
                      >
                        Rechazar
                      </button>
                      <button
                        className="emptyButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setDisappearing(index);
                          setTimeout(() => deleteGroupEvent(event), 800);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>- No hay eventos -</p>
          )}
        </div>

        <div className={styles.grupalDates03}>
          <h3>Eventos rechazados</h3>
          {events.filter((event) => event.status === 'rejected').length > 0 ? (
            events
              .filter((event) => event.status === 'rejected')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event, index) => (
                <div
                  className={`${styles.card} ${isFlipped === index ? styles.flipped : ''} ${disappearing === index ? styles.disappearing : ''}`}
                  onClick={() => setIsFlipped(index)}
                  key={index}
                >
                  <div className={styles.cardInner}>
                    <div
                      className={`${styles.cardFace} ${styles.cardFaceFront}`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <strong>
                        {event.date.split('-').reverse().join('-')}
                      </strong>
                      <strong>{event.extendedProps.groupName}</strong>
                      <p className={styles.eventTime}>
                        <span className="material-symbols-outlined">
                          schedule
                        </span>{' '}
                        {event.time}
                      </p>
                      <p>{event.extendedProps.eventTitle}</p>
                      <p> {event.extendedProps.location}</p>
                    </div>
                    <div className={styles.cardFaceBack}>
                      <button className={`emptyButton ${styles.detailButton}`}>
                        Detalles
                      </button>
                      <button
                        className="emptyButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setDisappearing(index);
                          setTimeout(() => deleteGroupEvent(event), 1000);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>- No hay eventos -</p>
          )}
        </div>
      </main>
    </>
  );
}
