import pdf from 'pdf-parse';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdf(buffer);
  return NextResponse.json({ text: data.text });
}
