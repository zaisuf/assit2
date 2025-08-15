

// This API route reads UI design data from Firestore at:
// /users/{userId}/uidesing/{designId}
// Make sure your frontend saves UI config to this exact path.
import { db } from '@/app/api/firebase/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

// Helper to filter out non-serializable values
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
        // skip functions, classes, React elements, undefined, etc.
        result[key] = null;
      }
    }
    return result;
  }
  return obj;
}

export async function GET(req: NextRequest) {
  // Get designId and userId from query string
  const { searchParams } = new URL(req.url);
  const designId = searchParams.get('designId');
  const userId = searchParams.get('userId') || 'test-user-id'; // allow userId to be passed, fallback to test-user-id
  if (!designId) {
    return NextResponse.json({ error: 'Missing designId' }, { status: 400 });
  }

  try {
    // Read UI config from Firestore at /users/{userId}/uidesing/{designId}
    // This must match the path used when saving UI config from the frontend
    const docRef = db.collection('users').doc(userId).collection('uidesing').doc(designId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      console.error(`Design not found: userId=${userId}, designId=${designId}`);
      return NextResponse.json({ error: 'Design not found', userId, designId }, { status: 404 });
    }
    const data = docSnap.data();
    if (!data || Object.keys(data).length === 0) {
      console.error(`Design document is empty: userId=${userId}, designId=${designId}`);
      return NextResponse.json({ error: 'Design document is empty', userId, designId }, { status: 404 });
    }
    const safeConfig = sanitize(data);
    return NextResponse.json({ config: safeConfig });
  } catch (err) {
    console.error('Error fetching design:', err);
    return NextResponse.json({ error: 'Error fetching design', details: String(err), userId, designId }, { status: 500 });
  }
}
