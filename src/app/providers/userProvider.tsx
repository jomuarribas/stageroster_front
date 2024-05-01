// @ts-nocheck
'use client';
import React, { createContext, useEffect, useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader/Loader';
import { useApi } from '../hooks/useApi';

interface User {
  _id: string;
  name: string;
  username: string;
  img?: string;
  surnames: string;
  groups: [];
  myDates: string[]; // Corregido: especificar el tipo de myDates como string[]
}

interface Group {
  _id: string;
  identifier: string;
  name: string;
  description: string;
  members: [];
  createdAt: string;
  events: []; // Corregido: especificar el tipo de events como string[]
}

const UserContext = createContext({
  user: {} as User,
  setUser: (userData: User) => {},
  groups: [] as Group[], // Corregido: especificar el tipo de los elementos del array como Group
  setGroups: (groupsData: Group[]) => [], // Corregido: especificar el tipo de groupsData como Group[]
  events: [] as string[], // Corregido: especificar el tipo como string[]
  setEvents: (eventsData: string[]) => [], // Corregido: especificar el tipo como string[]
});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>({} as User);
  const [groups, setGroups] = useState<Group[]>([]); // Corregido: especificar el tipo de groups como Group[]
  const [events, setEvents] = useState<string[]>([]); // Corregido: especificar el tipo de events como string[]
  const { apiFetch, loading } = useApi();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user.user._id) {
      const fetchUser = async () => {
        try {
          const userData = await apiFetch(
            false,
            'GET',
            `users/${session.user.user._id}`,
            null,
            null,
          );
          setUser(userData);

          const fetchGroups = async () => {
            try {
              const groupsData = await apiFetch(
                false,
                'GET',
                `groups/find/${userData._id}`,
                null,
                null,
              );
              setGroups(groupsData);
              setEvents([
                ...userData.mydates,
                ...groupsData.map((group: Group) => group.events).flat(),
              ]);
            } catch (error) {
              console.error('Error al obtener los grupos:', error);
            }
          };

          fetchGroups();
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
        }
      };

      fetchUser();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return <Loader />;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        groups,
        setGroups,
        events,
        setEvents,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

