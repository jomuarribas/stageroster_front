// @ts-nocheck
'use client';
import { useUser } from '@/app/providers/userProvider';
import styles from './page.module.css';
import { useApi } from '@/app/hooks/useApi';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PendingEvents from '@/app/components/modals/pendingEvents/pendingEvents';

export default function Home() {
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

  const confirmGroupEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    const name = e.target.parentElement.parentElement.children[0].innerText;
    const match = name.match(/\(([^)]+)\)/);
    const date = name.replace(/\([^)]*\)/g, '').trim();
    const data = {
      date: date.split('-').reverse().join('-'),
      accept: true,
      userId: user._id,
    };
    const response = await apiFetch(
      true,
      'PUT',
      `groups/updateevent/${match[1]}`,
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

  const rejectGroupEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    const name = e.target.parentElement.parentElement.children[0].innerText;
    const match = name.match(/\(([^)]+)\)/);
    const date = name.replace(/\([^)]*\)/g, '').trim();
    const data = {
      date: date.split('-').reverse().join('-'),
      reject: true,
    };
    await apiFetch(true, 'PUT', `groups/updateevent/${match[1]}`, data, null);
    setEvents((currentEvents) => {
      return currentEvents.map((event) => {
        if (event.date === data.date) {
          event.status = 'rejected';
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
          </div>
        </div>
        <div id="pendingEvents" className={styles.pendingEvents}></div>
        <div className={styles.grupalDates}>
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
                  <p>
                    {event.date.split('-').reverse().join('-')} (
                    {event.extendedProps.groupName})
                  </p>
                  <p>
                    {event.extendedProps.eventTitle} en{' '}
                    {event.extendedProps.location}
                  </p>
                  <div className={styles.pendingButtons}>
                    {!event.acceptedBy.some(
                      (acceptedUser) => acceptedUser._id === user._id,
                    ) && <button onClick={confirmGroupEvent}>Confirmar</button>}
                    <button onClick={rejectGroupEvent}>Rechazar</button>
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
                            color: 'red',
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

        <div className={styles.grupalDates}>
          <h3>Eventos confirmados</h3>
          {events.filter((event) => event.status === 'confirmed').length > 0 ? (
            events
              .filter((event) => event.status === 'confirmed')
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
            <p>- No hay eventos -</p>
          )}
        </div>

        <div className={styles.grupalDates}>
          <h3>Eventos rechazados</h3>
          {events.filter((event) => event.status === 'rejected').length > 0 ? (
            events
              .filter((event) => event.status === 'rejected')
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
            <p>- No hay eventos -</p>
          )}
        </div>
      </main>
    </>
  );
}
