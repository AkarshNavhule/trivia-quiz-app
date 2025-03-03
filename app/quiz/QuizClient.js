'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuizClient({ questions, user }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [correctAnswersMap, setCorrectAnswersMap] = useState({});
  const router = useRouter();

  function handleAnswerSelect(qIndex, answer) {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: answer }));
  }

  async function handleSubmit() {
    // 1) Determine correct answers
    let correctCount = 0;
    const correctMap = {};

    questions.forEach((q, i) => {
      correctMap[i] = q.correct_answer;
      if (selectedAnswers[i] === q.correct_answer) {
        correctCount++;
      }
    });

    // 2) Calculate score percentage
    const scorePercentage = (correctCount / questions.length) * 100;
    setScore(scorePercentage);

    // 3) Show correct answers in green, etc.
    setCorrectAnswersMap(correctMap);
    setShowAnswers(true);

    // 4) Post score to DB
    await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.userId,
        userName: user.userName,
        userEmail: user.userEmail,
        userPhoto: user.userPhoto,
        scorePercentage,
      }),
    });

    // 5) Wait a few seconds, then redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 11000);
  }

  // Helper to compute label style
  function getLabelStyle(ans, i) {
    const isSelected = selectedAnswers[i] === ans;
    const isCorrectAnswer = showAnswers && ans === correctAnswersMap[i];
    const isWrongAnswer = showAnswers && isSelected && ans !== correctAnswersMap[i];

    let style = {
      display: 'block',
      borderRadius: '4px',
      marginBottom: '0.5rem',
      padding: '0.25rem',
    };

    if (!showAnswers) {
      // BEFORE submission: highlight selected option in orange background
      if (isSelected) {
        style.backgroundColor = '#616263';
      }
    } else {
      // AFTER submission
      if (isCorrectAnswer) {
        // correct option in green, bold
        style.color = 'green';
        style.fontWeight = 'bold';
      } else if (isWrongAnswer) {
        // user selected a wrong answer => red
        style.color = 'red';
      }
    }

    return style;
  }

  return (
    <div className="quiz-container">
      <h1>Trivia Quiz</h1>

      {questions.map((q, i) => {
        // Shuffle correct + incorrect answers
        const answers = [...q.incorrect_answers, q.correct_answer].sort(
          () => Math.random() - 0.5
        );

        return (
          <div className="question-block" key={i}>
            <h3 dangerouslySetInnerHTML={{ __html: q.question }} />
            <div className="question-options">
              {answers.map((ans) => {
                const labelStyle = getLabelStyle(ans, i);
                const isSelected = selectedAnswers[i] === ans;

                return (
                  <label key={ans} style={labelStyle}>
                    <input
                      type="radio"
                      name={`question-${i}`}
                      onChange={() => handleAnswerSelect(i, ans)}
                      checked={isSelected}
                      disabled={showAnswers} // disable changes after submit
                    />
                    <span dangerouslySetInnerHTML={{ __html: ans }} />
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {score === null ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      ) : (
        <h2>Your Score: {score.toFixed(2)}%</h2>
      )}

      <p>
        <Link href="/dashboard">Go to Dashboard</Link>
      </p>

      {/* Styled JSX for layout and styling */}
      <style jsx>{`
        .quiz-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
          text-align: center;
        }

        .question-block {
          background: #2b2b2b;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .question-options {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          row-gap: 0.5rem;
          margin-top: 0.5rem;
        }

        h1 {
          margin-bottom: 1rem;
        }

        h3 {
          margin-bottom: 0.5rem;
          color: #ff7b00; /* bright color for questions */
        }

        input[type='radio'] {
          margin-right: 0.5rem;
        }

        .submit-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #ff7b00;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s, transform 0.2s;
        }

        .submit-button:hover {
          background-color: #e46800;
          transform: translateY(-2px);
        }

        p {
          text-align: center;
          margin-top: 2rem;
        }

        @media (max-width: 480px) {
          .quiz-container {
            padding: 0.5rem;
          }

          .question-block {
            margin-bottom: 1rem;
            padding: 0.75rem;
          }

          .submit-button {
            width: 100%;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
