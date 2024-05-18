'use client';
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../components/Header/Header';
import ScrollToTopOnRender from '../utils/ScrollToTopOnRender';
import CreateGroupModal from '../components/modals/createGroup/CreateGroup-modal';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader/Loader';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'authenticated') {
    return (
      <>
        <CreateGroupModal />
        <Header />
        {children}
        <ScrollToTopOnRender />
      </>
    );
  }
}
