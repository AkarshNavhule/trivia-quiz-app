'use client';

import React, { useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardClient({ scores }) {
  const { data: session, status } = useSession();
  const [isSignedOut, setIsSignedOut] = useState(false);
  const [localScores, setLocalScores] = useState([]);
  if (status === 'loading') {
    return <p className="container">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="container">
        <h2>Signin with google</h2>
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
          Sign in with Google
        </button>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    setIsSignedOut(true);
  }

  async function handleClearHistory() {
    // Make sure you have a DELETE handler in /api/score that deletes all scores for userId
    await fetch('/api/score', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id }),
    });

    // Refresh local state so scores list is empty
    setLocalScores([]);
    localStorage.removeItem("quizScores");
  } 


  if (isSignedOut) {
    return (
      <div className="container">
        <h2>You have signed out.</h2>
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
          Sign in again
        </button>
      </div>
    );
  }

  const userName = session.user?.name || 'Unknown User';
  const userImage = session.user?.image;
  const userEmail = session.user?.email;

  return (
    <div className="container">
      <h2>Welcome, {userName}!</h2>
      {userImage && (
        <Image
          src={userImage}
          alt={userName}
          width={80}
          height={80}
        />
      )}
      {userEmail && <p>Email: {userEmail}</p>}

      {/* Scores list */}
      {scores.length === 0 ? (
        <div>
          <p>No scores yet.</p>
          <Link href="/quiz">
            <button>Play Quiz</button>
          </Link>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <ul>
            {scores.map((score) => {
              const percentage = score.scorePercentage?.toFixed(2) ?? '0.00';
              return (
                <li key={score._id}>
                  <strong>Score:</strong> {percentage}% <br />
                  <strong>Date:</strong> {new Date(score.date).toLocaleString()}
                </li>
              );
            })}
          </ul>
          <Link href="/quiz">
            <button>Play Quiz</button>
          </Link>
          <button onClick={handleSignOut}>Sign Out</button>
          {/* Example: Clear History button, etc. */}

          <button onClick={handleClearHistory} style={{ marginLeft: '1rem' }}>
            Clear History
          </button>
        </div>

        
      )}
    </div>
  );
}
