import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    const userRef = db.collection('users').doc(id);
    await userRef.delete();
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } 
  catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}