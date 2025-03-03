// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers'; // Import the client Providers

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Trivia Quiz App',
  description: 'A simple quiz app with NextAuth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire app with SessionProvider via Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
