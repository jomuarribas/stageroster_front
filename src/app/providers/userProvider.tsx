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
  setGroups: (groupsData: Group[]) => [], // Corregido: especificar el tipo como Group[]
  events: [] as string[], // Corregido: especificar el tipo como string[]
  setEvents: (eventsData: string[]) => [], // Corregido: especificar el tipo como string[]
});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>({} as User);
  const [groups, setGroups] = useState<Group[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const { apiFetch } = useApi();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.user?._id) {
      const fetchData = async () => {
        try {
          const userData = await apiFetch(
            false,
            'GET',
            `users/${session.user.user._id}`,
            null,
            null,
          );

          const groupsData = await apiFetch(
            false,
            'GET',
            `groups/find/${session.user.user._id}`,
            null,
            null,
          );

          setUser(userData);
          setGroups(groupsData);
          setEvents([
            ...userData.mydates,
            ...groupsData.flatMap((group: Group) => group.events),
          ]);
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };

      fetchData();
    }
  }, [status, session]);

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
