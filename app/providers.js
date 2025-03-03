'use client'; // This file must be a Client Component

import { SessionProvider } from 'next-auth/react';

// A wrapper that provides session context to its children
export function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
