'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const SessionAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <SessionHandler>{children}</SessionHandler>
    </SessionProvider>
  );
};

const SessionHandler = ({ children }: Props) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      localStorage.setItem('token', session.user.token);
    }
  }, [session]);

  return <>{children}</>;
};

export default SessionAuthProvider;
