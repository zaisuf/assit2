// src/app/api/public/get-design/route.ts
import { db } from '@/app/api/firebase/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

// Helper to filter out non-serializable values from Firestore data
function sanitize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj && typeof obj === 'object') {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      const val = obj[key];
      // Keep only primitive types, plain objects, and arrays
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
        // Discard functions, classes, React elements, undefined, etc.
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

  if (!designId) {
    return NextResponse.json({ error: 'Missing designId' }, { status: 400 });
  }

  // For public widgets, we always use a generic, non-permissioned user ID
  // to fetch the design data. This ensures no user-specific logic is triggered.
  const publicUserId = 'test-user-id';

  try {
    // The Firestore path must exactly match where the UI configs are saved.
    const docRef = db.collection('users').doc(publicUserId).collection('uidesing').doc(designId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.error(`Public design not found: designId=${designId}`);
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const data = docSnap.data();
    if (!data || Object.keys(data).length === 0) {
      console.error(`Public design document is empty: designId=${designId}`);
      return NextResponse.json({ error: 'Design document is empty' }, { status: 404 });
    }

    // Sanitize the data to prevent server errors with non-serializable fields
    const safeConfig = sanitize(data);
    return NextResponse.json({ config: safeConfig });

  } catch (err) {
    console.error('Error fetching public design:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Error fetching design', details: errorMessage }, { status: 500 });
  }
}
