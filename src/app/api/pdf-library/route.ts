import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { pdfLibrary } from '@/db/schema';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';

const pdfSchema = z.object({
  subjectId: z.coerce.number().int().positive(),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2000).default(''),
  fileUrl: z.string().url(),
  fileName: z.string().trim().min(1).max(255),
  fileSize: z.coerce.number().int().nonnegative().default(0),
  lecturerName: z.string().trim().max(120).optional().or(z.literal('')).transform((value) => value || null),
  publicationDate: z.string().datetime().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 });

  const rows = await db.select().from(pdfLibrary).orderBy(pdfLibrary.sortOrder);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });

  const payload = pdfSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: payload.error.flatten().fieldErrors }, { status: 400 });

  const [row] = await db.insert(pdfLibrary).values({
    subjectId: payload.data.subjectId,
    title: payload.data.title,
    description: payload.data.description,
    fileUrl: payload.data.fileUrl,
    fileName: payload.data.fileName,
    fileSize: payload.data.fileSize,
    lecturerName: payload.data.lecturerName,
    publicationDate: payload.data.publicationDate ? new Date(payload.data.publicationDate) : new Date(),
    updatedAt: new Date(),
  }).returning();

  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(request: Request) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'معرف الملف غير صالح.' }, { status: 400 });

  const [deleted] = await db.delete(pdfLibrary).where(eq(pdfLibrary.id, id)).returning({ id: pdfLibrary.id });
  if (!deleted) return NextResponse.json({ error: 'الملف غير موجود.' }, { status: 404 });
  return NextResponse.json({ ok: true, id: deleted.id });
}
