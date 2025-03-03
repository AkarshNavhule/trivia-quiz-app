// app/dashboard/page.js
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Score from '@/models/Score';
import DashboardClient from './DashboardClient';
import dbConnect from '@/lib/dbConnect';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main style={{ padding: '1rem' }}>
        <h1>Please sign in to view your dashboard.</h1>
        <p>
        <Link href="/api/auth/signin?callbackUrl=/dashboard">
          <button>Sign in with Google</button>
        </Link>
      </p>
      </main>
    );
  }

  // Fetch user’s scores
  await dbConnect();
  const rawDocs = await Score.find({ userId: session.user.id })
    .sort({ date: -1 })
    .lean();

  // Convert to plain objects (avoid passing Mongoose docs to client)
  const scores = rawDocs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    date: doc.date ? doc.date.toISOString() : '',
    scorePercentage: typeof doc.scorePercentage === 'number' ? doc.scorePercentage : 0,
  }));

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Dashboard</h1>
      <DashboardClient scores={scores} />
    </main>
  );
}
