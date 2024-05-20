// @ts-nocheck
'use client';
import styles from './page.module.css';
import Image from 'next/image';
import { useApi } from '@/app/hooks/useApi';
import { useState } from 'react';
import { useUser } from '@/app/providers/userProvider';

export default function User() {
  const { apiFetch, loading } = useApi();
  const [file, setFile] = useState(null);
  const { user, setUser, setGroups, groups, events } = useUser();

  const handleFileChange = async (e: MouseEvent) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const route = `users/update/${user._id}`;

    const formData = new FormData();
    formData.append('img', selectedFile);

    try {
      const data = await apiFetch(
        true,
        'PUT',
        route,
        formData,
        null,
        'multipart/form-data',
      );
      setUser(data.user);
      setGroups(data.user.groups);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  return (
    <main className={styles.user}>
      <section>
        <div className={styles.imageContainer}>
          <Image
            src={user.img ? user.img : '/assets/user.png'}
            alt="Imagen de perfil"
            width={100}
            height={100}
            priority
          />
          <div className={styles.addImage}>
            <label htmlFor="fileInput">
              <span className="material-symbols-outlined">photo_camera</span>
            </label>
            <input
              id="fileInput"
              type="file"
              name="img"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className={styles.nameContainer}>
          <h2>
            {user.name} {user.surnames}
          </h2>
          <h3>@{user.username}</h3>
          <p>
            Eventos Confirmados:{' '}
            {
              events.filter(
                (event) =>
                  event.title === 'Grupal' && event.status === 'confirmed',
              ).length
            }
          </p>
          <p>
            Eventos Pendientes:{' '}
            {
              events.filter(
                (event) =>
                  event.title === 'Grupal' && event.status === 'pending',
              ).length
            }
          </p>
          <p>Eventos Personales: {user.mydates?.length}</p>
        </div>
      </section>
      <section>
        <h2>Información</h2>
        <div className={styles.infoContainer}>
          <div>
            <p>
              <strong>Email: </strong>
              {user?.email}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
