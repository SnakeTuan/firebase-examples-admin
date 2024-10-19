import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    const docRef = await db.collection('users').add({ name, email });
    return NextResponse.json({ id: docRef.id, name, email }, { status: 201 });
  }
  catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}