// @ts-nocheck
'use client';
import { useUser } from '@/app/providers/userProvider';
import styles from './deleteUser.module.css';
import { useApi } from '@/app/hooks/useApi';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DeleteUserModal({ closeModal }) {
  const router = useRouter();
  const { user } = useUser();
  const { apiFetch } = useApi();

  const deleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const route = `users/delete/${user._id}`;
    const dataForm = {
      userId: user._id,
      password: e.target.password.value,
    };

    try {
      const data = await apiFetch(true, 'DELETE', route, dataForm, null);
      if (data.message) {
        signOut();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <div className={styles.deleteUserModal}>
      <div>
        <form onSubmit={deleteUser}>
          <h3>Eliminar cuenta:</h3>
          <p>
            <strong>¡Estas a punto de eliminar tu cuenta!.</strong> Para que
            podamos proceder a la eliminación total de todos tus datos debes de
            indicar de nuevo tu contraseña. ¡Gracias!
          </p>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Introduce tu contraseña"
            required
            name="password"
          />
          <div>
            <button onClick={closeModal}>Cancelar</button>
            <button type="submit">Eliminar cuenta</button>
          </div>
        </form>
      </div>
    </div>
  );
}
