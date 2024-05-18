'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const SessionAuthProvider = ({ children }: Props) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      localStorage.setItem('token', session.user.token);
    }
  }, [session]);

  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionAuthProvider;
