// app/quiz/page.js (Server Component)
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import QuizClient from './QuizClient';

export default async function QuizPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please sign in to access the quiz.</div>;
  }

  // Example fetch to your own /api/trivia route
  const res = await fetch('https://trivia-quiz-app-kohl.vercel.app/api/trivia', { cache: 'no-store' });
  const triviaData = await res.json();
  const questions = triviaData.results || [];

  // Pass user data as props to the Client Component
  const userProps = {
    userId: session.user.id,
    userName: session.user.name || '',
    userEmail: session.user.email || '',
    userPhoto: session.user.image || '',
  };

  return <QuizClient questions={questions} user={userProps} />;
}
