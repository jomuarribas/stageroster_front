import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './globalicons.css';
import ScrollToTopOnRender from './utils/ScrollToTopOnRender';
import AlertProvider from './providers/AlertContext';
import ErrorMessage from './components/modals/errorMessage/errorMessage';
import SuccessMessage from './components/modals/successMessage/successMessage';
import SessionAuthProvider from './providers/SessionAuthProvider';
import UserProvider from './providers/userProvider';
import WarningMessage from './components/modals/warningMessage/warningMessage';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stage Roster',
  description:
    'Aplicación para gestionar y coordinar conciertos y eventos entre los propios miembros de la banda.',
  keywords: [
    'conciertos',
    'eventos',
    'música',
    'banda',
    'gestión',
    'grupos',
    'agenda',
    'calendario',
    'coordinación',
    'músicos',
    'artistas',
    'escenarios',
    'salas',
    'festivales',
    'organización',
  ],
  creator: 'Jonathan Muñoz Arribas',
  authors: [{ name: 'jomuarribas', url: 'https://jomuarribas.com' }],
  publisher: 'Stage Roster',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-ES">
      <body id="body" className={inter.className}>
        <AlertProvider>
          <SessionAuthProvider>
            <UserProvider>
              {children}
              <ErrorMessage />
              <WarningMessage />
              <SuccessMessage />
            </UserProvider>
          </SessionAuthProvider>
        </AlertProvider>
        <ScrollToTopOnRender />
      </body>
    </html>
  );
}
