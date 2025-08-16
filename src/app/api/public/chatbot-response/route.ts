// src/app/api/public/chatbot-response/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/api/firebase/firebase-admin';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper to fetch knowledge base from Firestore
async function getKnowledgeBase(designId: string): Promise<string> {
  // For public widgets, we always use the generic 'test-user-id'
  const publicUserId = 'test-user-id';
  try {
    // This path must match where you store the knowledge base data
    const docRef = db.collection('users').doc(publicUserId).collection('uidesing').doc(designId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      // Assuming the knowledge is stored in a field called 'knowledgeBase' or similar
      // You might need to adjust this based on your actual data structure
      return data?.knowledgeBase || data?.context || JSON.stringify(data);
    }
    return 'No specific knowledge base found for this design.';
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return 'Could not retrieve knowledge base.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, designId, conversationHistory } = await req.json();

    if (!message || !designId) {
      return NextResponse.json({ error: 'Missing message or designId' }, { status: 400 });
    }

    const knowledgeBase = await getKnowledgeBase(designId);

    const systemPrompt = `You are a helpful assistant for the website. Use the following context to answer questions. If you don't know the answer from the context, say that you don't know. CONTEXT: ${knowledgeBase}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        // Include past messages if provided
        ...(conversationHistory || []),
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-8b-8192', // or another model you prefer
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error in public chatbot response API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to get response from AI', details: errorMessage }, { status: 500 });
  }
}
