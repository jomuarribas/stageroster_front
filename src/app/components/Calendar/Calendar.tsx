// @ts-nocheck
'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './Calendar.module.css';
import { useUser } from '@/app/providers/userProvider';

export default function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { events } = useUser();

  // Función para manejar el clic en un día del calendario
  const handleDayClick = (clickedDate) => {
    const clickedMoment = moment(clickedDate);
    const event = events.find((event) => {
      const eventMoment = moment(event.date);
      return eventMoment.isSame(clickedMoment, 'day');
    });
    setSelectedEvent(event);
  };

  // Filtrar eventos con title "Personal" y status "confirmed"
  const personalEvents = events.filter((event) => event.title === 'Personal');

  // Filtrar eventos con title "Grupal" y status "confirmed"
  const grupalEvents = events.filter(
    (event) => event.title === 'Grupal' && event.status === 'confirmed',
  );

  // Unir eventos filtrados
  const filteredEvents = [...personalEvents, ...grupalEvents];

  const tileContent = ({ date }) => {
    const currentMoment = moment(date);
    const event = filteredEvents.find((event) => {
      const eventMoment = moment(event.date);
      return eventMoment.isSame(currentMoment, 'day');
    });
    if (event) {
      return <div className={styles.tileContent}>{event.title}</div>;
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    const currentMoment = moment(date);
    const event = filteredEvents.find((event) => {
      const eventMoment = moment(event.date);
      return eventMoment.isSame(currentMoment, 'day');
    });
    if (event) {
      return event.title === 'Personal'
        ? styles.personalEvent
        : styles.grupalEvent;
    }
    return null;
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendar}>
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDayClick}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
      </div>
      {!selectedEvent ? (
        <p className={styles.noEvent}>No hay ningún evento en esta fecha.</p>
      ) : (
        <div className={styles.eventDetails}>
          <h3>
            {selectedEvent.date.split('-').reverse().join('-')} (
            {selectedEvent.title === 'Grupal'
              ? selectedEvent.extendedProps.groupName
              : 'Personal'}
            )
          </h3>
          <p>Ubicacion: {selectedEvent.extendedProps.location}</p>
          <p>{selectedEvent.extendedProps.description}</p>
        </div>
      )}
    </div>
  );
}
