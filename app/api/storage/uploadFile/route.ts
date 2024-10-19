import { NextResponse } from 'next/server';
import { storage } from '@/config/firebase';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;
  storage.bucket("gs://test-project-80867.appspot.com").upload

  console.log("File:", file)
  console.log("User ID:", userId)

  return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
}

function ref(storage: Storage, arg1: string) {
    throw new Error('Function not implemented.');
}
