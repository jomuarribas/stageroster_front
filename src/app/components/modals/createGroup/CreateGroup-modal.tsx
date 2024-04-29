'use client';
import { useUser } from '@/app/providers/userProvider';
import styles from './CreateGroup-modal.module.css';
import { useApi } from '@/app/hooks/useApi';

export default function CreateGroupModal() {
  const { user, setUser, groups, setGroups } = useUser();
  const { apiFetch } = useApi();

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

  if (groups.length > 0) {
    return null;
  }

  return (
    <div className={styles.groupsModal}>
      <div>
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
            required
            name="description"
          />
          <button type="submit">Crear</button>
        </form>

        <form className={styles.logGroupModal} onSubmit={addGroup}>
          <h3>Unete a un grupo:</h3>
          <label htmlFor="identification">Introduce el identificador</label>
          <input
            type="text"
            id="name"
            name="identifier"
            placeholder="Identificador"
            required
          />
          <button type="submit">Unirse</button>
        </form>
      </div>
    </div>
  );
}
