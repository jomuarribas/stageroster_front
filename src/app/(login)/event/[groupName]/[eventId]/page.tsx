'use client';
import { useApi } from '@/app/hooks/useApi';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Page({
  params,
}: {
  params: { groupName: string; eventId: string };
}) {
  const [event, setEvent] = useState(null as any);
  const { apiFetch } = useApi();

  const handleEvent = async () => {
    try {
      const route = `groups/event/${params.groupName}/${params.eventId}`;

      const response = await apiFetch(true, 'GET', route, null, null);

      if (response) {
        setEvent(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleEvent();
  }, []);

  const updateEvent = async (e: any) => {
    e.preventDefault();

    const title = e.target.title.value;
    const cache = e.target.cache.value;
    const currency = e.target.currency.value;
    const timeStart = e.target.timeStart.value;
    const time = e.target.time.value;
    const location = e.target.location.value;
    const city = e.target.city.value;
    const address = e.target.address.value;
    const contactDates = e.target.contactDates.value;
    const description = e.target.description.value;
    const tecnicalDates = e.target.tecnicalDates.value;
    const otherDates = e.target.otherDates.value;

    const data = {
      title,
      cache,
      currency,
      timeStart,
      time,
      location,
      city,
      address,
      contactDates,
      description,
      tecnicalDates,
      otherDates,
    };

    try {
      const route = `groups/event/modify/${params.groupName}/${params.eventId}`;

      const response = await apiFetch(true, 'PUT', route, data, null);

      if (response.message) {
        setEvent(response.event);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      {event && (
        <section className={styles.event}>
          <h2>{event.date.split('-').reverse().join('-')}</h2>
          <h3>{event.extendedProps.groupName}</h3>
          <form onSubmit={updateEvent}>
            <div>
              <input
                type="text"
                defaultValue={event.extendedProps.eventTitle}
                id="title"
              ></input>
            </div>
            <div className={styles.currency}>
              <label htmlFor="cache">
                <strong>Caché: </strong>
              </label>
              <input
                type="number"
                defaultValue={
                  event.extendedProps.cache
                    ? `${event.extendedProps.cache}`
                    : ''
                }
                id="cache"
              ></input>
              <select name="currrency" id="currency">
                <option value="EUR">
                  {event.extendedProps.currency
                    ? event.extendedProps.currency
                    : '-'}
                </option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeStart">
                <strong>Llegada: </strong>
              </label>
              <input
                type="time"
                defaultValue={
                  event.extendedProps.timeStart
                    ? event.extendedProps.timeStart
                    : ''
                }
                id="timeStart"
              ></input>
            </div>
            <div>
              <label htmlFor="time">
                <strong>Comienzo: </strong>
              </label>
              <input
                type="time"
                defaultValue={event.time ? event.time : ''}
                id="time"
              ></input>
            </div>
            <div>
              <label htmlFor="location">
                <strong>Población: </strong>
              </label>
              <input
                defaultValue={event.extendedProps.location}
                id="location"
              ></input>
            </div>
            <div>
              <label htmlFor="city">
                <strong>Ciudad: </strong>
              </label>
              <input
                defaultValue={
                  event.extendedProps.city ? event.extendedProps.city : ''
                }
                id="city"
              ></input>
            </div>
            <div>
              <label htmlFor="address">
                <strong>Dirección: </strong>
              </label>
              <input
                defaultValue={
                  event.extendedProps.address ? event.extendedProps.address : ''
                }
                id="address"
              ></input>
            </div>
            <div className={styles.textareaForm}>
              <label htmlFor="contactDates">
                <strong>Datos del contacto: </strong>
              </label>
              <textarea
                placeholder="Introducir los datos de contacto del evento, como el nombre de la persona de contacto, su teléfono, su email, etc."
                defaultValue={
                  event.extendedProps.contactDates
                    ? event.extendedProps.contactDates
                    : ''
                }
                id="contactDates"
              ></textarea>
            </div>
            <div className={styles.textareaForm}>
              <label htmlFor="description">
                <strong>Descripción: </strong>
              </label>
              <textarea
                defaultValue={
                  event.extendedProps.description
                    ? event.extendedProps.description
                    : ''
                }
                id="description"
              ></textarea>
            </div>
            <div className={styles.textareaForm}>
              <label htmlFor="tecnicalDates">
                <strong>Datos técnicos: </strong>
              </label>
              <textarea
                placeholder="Introducir los datos técnicos del evento, como el rider técnico que vas a necesitar, el backline, etc."
                defaultValue={
                  event.extendedProps.tecnicalDates
                    ? event.extendedProps.tecnicalDates
                    : ''
                }
                id="tecnicalDates"
              ></textarea>
            </div>
            <div className={styles.textareaForm}>
              <label htmlFor="otherDates">
                <strong>Otros datos: </strong>
              </label>
              <textarea
                placeholder="Introducir otros datos que sean necesarios para el evento."
                defaultValue={
                  event.extendedProps.otherDates
                    ? event.extendedProps.otherDates
                    : ''
                }
                id="otherDates"
              ></textarea>
            </div>
            <input type="submit" value="Actualizar" className="emptyButton" />
          </form>
        </section>
      )}
    </main>
  );
}
