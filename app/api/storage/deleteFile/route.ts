import { NextResponse } from 'next/server';
import { storage, db } from '@/config/firebase';

export async function POST(request: Request) {
    const { userId } = await request.json();

    const bucket = storage.bucket("gs://test-project-80867.appspot.com")

    await bucket.file(`users/${userId}/avatar.jpg`).delete()

    await db.collection('users').doc(userId).update({
        avatarUrl: null
    })

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
}

