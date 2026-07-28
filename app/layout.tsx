import type { Metadata } from 'next';
import './globals.css';
import MusicControl from '@/components/MusicControl';

export const metadata: Metadata = {
  title: 'Invitación de Discernimiento',
  description: 'Invitación personalizada con acceso por contraseña y desbloqueo programado.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <MusicControl />
        {children}
      </body>
    </html>
  );
}
