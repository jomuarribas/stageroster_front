import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../components/Header/Header';
import ScrollToTopOnRender from '../utils/ScrollToTopOnRender';
import CreateGroupModal from '../components/modals/createGroup/CreateGroup-modal';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CreateGroupModal />
      <Header />
      {children}
      <ScrollToTopOnRender />
    </>
  );
}
