// @ts-nocheck
'use client';
import { useUser } from '@/app/providers/userProvider';
import styles from './page.module.css';
import Image from 'next/image';
import { useApi } from '@/app/hooks/useApi';
import { use } from 'react';

export default function Groups() {
  const { user, setUser, groups, setGroups } = useUser();
  const { apiFetch } = useApi();

  const copyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const text = e.target.parentElement.childNodes[1].textContent;
    try {
      const temporalElement = document.createElement('textarea');
      temporalElement.value = text;
      document.body.appendChild(temporalElement);
      temporalElement.select();
      document.execCommand('copy');
      document.body.removeChild(temporalElement);
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
    }
  };

  const createGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const route = 'groups/register';
    const dataForm = {
      name: e.target.name.value,
      description: e.target.description.value,
      createdBy: user._id,
    };

    try {
      const dataGroup = await apiFetch(true, 'POST', route, dataForm, null);
      setGroups([...groups, dataGroup.savedGroup]);
      setUser({ ...user, groups: [...user.groups, dataGroup.savedGroup] });
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  const addGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const route = `users/addgroup/${user._id}`;
    const dataForm = {
      identifier: e.target.identifier.value,
    };

    try {
      const dataGroup = await apiFetch(true, 'POST', route, dataForm, null);
      setGroups([...groups, dataGroup.group]);
      setUser({ ...user, groups: [...user.groups, dataGroup.group] });
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  const deleteGroup = async (
    e: React.FormEvent<HTMLFormElement>,
    groupId: string,
  ) => {
    e.preventDefault();
    const route = `groups/delete/${groupId}`;
    const userId = { userId: user._id };

    try {
      const fetch = await apiFetch(true, 'DELETE', route, userId, null);
      const newGroups = groups.filter((group) => group._id !== groupId);
      if (fetch.message) {
        setUser({ ...user, groups: newGroups });
        setGroups(newGroups);
      }
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  };

  const exitGroup = async (
    e: React.FormEvent<HTMLFormElement>,
    groupId: string,
  ) => {
    e.preventDefault();
    const route = `users/deletegroup/${groupId}`;
    const userId = { userId: user._id };

    try {
      await apiFetch(true, 'POST', route, userId, null);
      const newGroups = groups.filter((group) => group._id !== groupId);
      setGroups(newGroups);
      setUser({ ...user, groups: newGroups });
    } catch (error) {
      console.error('Error al salir del grupo:', error);
    }
  };

  return (
    <main className={styles.groups}>
      <h2>Mis grupos</h2>
      <div className={styles.group}>
        {groups.length <= 0 ? (
          <p>No perteneces a ningún grupo.</p>
        ) : (
          groups.map((group) => (
            <div key={group._id} className={styles.groupIndiv}>
              <h3>
                {group.name}
                <div>
                  <span
                    className="material-symbols-outlined"
                    onClick={(e) => deleteGroup(e, group._id)}
                  >
                    delete
                  </span>
                  <span
                    className="material-symbols-outlined"
                    onClick={(e) => exitGroup(e, group._id)}
                  >
                    exit_to_app
                  </span>
                </div>
              </h3>
              <p className={styles.groupDescription}>{group.description}</p>
              <p>
                <strong>Identificador: </strong>
                {group.identifier}
                <span
                  className="material-symbols-outlined"
                  onClick={copyToClipboard}
                >
                  content_copy
                </span>
              </p>
              <p>
                <strong>Nº de integrantes: </strong>
                {group.members.length}
              </p>
              <p>
                <strong>Creado por: </strong>
                {group.createdBy.username}
              </p>
              <div className={styles.users}>
                <h4>INTEGRANTES</h4>
                {group.members.map((user, index) => (
                  <div key={index} className={styles.usernameImg}>
                    <Image
                      src={user.img ? user.img : '/assets/user.png'}
                      alt="Imagen de perfil"
                      width={100}
                      height={100}
                      priority
                    />
                    <p>{user.username}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.groupsForm}>
        <form onSubmit={createGroup}>
          <h3>Crea un grupo:</h3>
          <label htmlFor="name">Nombre del grupo</label>
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
          <button type="submit">Crear</button>
        </form>

        <form className={styles.logGroup} onSubmit={addGroup}>
          <h3>Unete a un grupo:</h3>
          <label htmlFor="identification">Introduce el identificador</label>
          <input
            type="text"
            id="name"
            placeholder="Identificador"
            name="identifier"
          />
          <button type="submit">Unirse</button>
        </form>
      </div>
    </main>
  );
}
