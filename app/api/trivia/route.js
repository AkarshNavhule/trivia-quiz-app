// app/api/trivia/route.js

export async function GET() {
    try {
      // Fetch 10 random questions from Open Trivia DB
      const response = await fetch('https://opentdb.com/api.php?amount=10');
      const data = await response.json();
  
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch trivia' }), {
        status: 500,
      });
    }
  }
  