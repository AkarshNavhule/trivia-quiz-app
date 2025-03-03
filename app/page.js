// app/page.js

import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <main  className="container">
        <h1>You are already signed in!</h1>
        <p>
          <Link href="/dashboard">Go to Dashboard</Link>
        </p>
      </main>
    );
  }

  // If not signed in, show Google sign-in link as a button
  return (
    <main className="container">
      <h1>Welcome to the Trivia Quiz App</h1>
      <p>Sign in with Google to get started.</p>
      <p>
        <Link href="/api/auth/signin?callbackUrl=/dashboard">
          <button>Sign in with Google</button>
        </Link>
      </p>
    </main>
  );
}