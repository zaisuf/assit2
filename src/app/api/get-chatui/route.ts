// API route to get only chat UI config for a given designId
import { db } from '@/app/api/firebase/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

function sanitize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj && typeof obj === 'object') {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      const val = obj[key];
      if (
        val === null ||
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean' ||
        Array.isArray(val) ||
        (typeof val === 'object' && val.constructor === Object)
      ) {
        result[key] = sanitize(val);
      } else {
        result[key] = null;
      }
    }
    return result;
  }
  return obj;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const designId = searchParams.get('designId');
  const userId = 'test-user-id';
  if (!designId) {
    return NextResponse.json({ error: 'Missing designId' }, { status: 400 });
  }

  try {
    // Fetch from /users/test-user-id/uidesing/{designId}
    const docRef = db.collection('users').doc(userId).collection('uidesing').doc(designId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Design not found', userId, designId }, { status: 404 });
    }
    const data = docSnap.data();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Design document is empty', userId, designId }, { status: 404 });
    }
  const safeConfig = sanitize(data);
  // Return the full config as saved in Firestore
  return NextResponse.json({ config: safeConfig });
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching chat UI', details: String(err), userId, designId }, { status: 500 });
  }
}
