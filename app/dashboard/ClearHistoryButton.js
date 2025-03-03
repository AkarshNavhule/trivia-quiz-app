'use client'; // <-- Tells Next.js this is a Client Component

import React from 'react';

export default function ClearHistoryButton({ userId }) {
  async function handleClearHistory() {
    await fetch('/api/score', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    // After deleting, refresh the page or revalidate:
    window.location.reload();
  }

  return (
    <button onClick={handleClearHistory}>
      Clear History
    </button>
  );
}
