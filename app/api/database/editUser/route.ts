import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function PUT(request: Request) {
  try {
    const { id, name, email } = await request.json();
    const userRef = db.collection('users').doc(id);
    await userRef.update({ name, email });
    return NextResponse.json({ id, name, email }, { status: 200 });
  } 
  catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}