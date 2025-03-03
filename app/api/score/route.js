// app/api/score/route.js

import dbConnect from '@/lib/dbConnect';
import Score from '@/models/Score';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, userName, userEmail, userPhoto, scorePercentage } = await request.json();

    // Create a new score document
    const newScore = await Score.create({
      userId,
      userName,
      userEmail,
      userPhoto,
      scorePercentage,
    });

    return new Response(JSON.stringify(newScore), { status: 201 });
  } catch (error) {
    console.error('Score submission failed:', error);
    return new Response(JSON.stringify({ error: 'Score submission failed' }), {
      status: 400,
    });
  }
}

// app/api/score/route.js
export async function DELETE(request) {
    await dbConnect();
    const { userId } = await request.json();
    await Score.deleteMany({ userId });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  

// Optionally handle DELETE for clearing scores, etc.
