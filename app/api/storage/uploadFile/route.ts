import { NextResponse } from 'next/server';
import { storage, db } from '@/config/firebase';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    const toArrayBuffer = await file.arrayBuffer()
    const getBuffer = Buffer.from(toArrayBuffer)

    const bucket = storage.bucket("gs://test-project-80867.appspot.com")

    await bucket.file(`users/${userId}/avatar.jpg`).save(getBuffer)


    // Set expiration to 10 years from now, this make the url for the file unique and prevent caching
    const url = await bucket.file(`users/${userId}/avatar.jpg`).getSignedUrl({
        action: 'read', 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 500
    })

    // Update the user document with the signed URL
    await db.collection('users').doc(userId).update({
        avatarUrl: url[0]
    })

    console.log(url)
   
    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
}
