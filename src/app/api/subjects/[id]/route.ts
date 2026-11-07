import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { pdfLibrary, subjects } from '@/db/schema';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';

const subjectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().default(''),
  icon: z.string().trim().max(60).optional().default('book-open'),
  color: z.string().trim().refine((value) => /^#[0-9a-fA-F]{6}$/.test(value), 'يجب أن يكون اللون بصيغة Hex').optional().default('#0d6fe8'),
  isVisible: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 });
  const subjectId = Number(params.id);
  if (!Number.isInteger(subjectId) || subjectId < 1) return NextResponse.json({ error: 'معرف المادة غير صالح.' }, { status: 400 });

  const [subject] = await db.select().from(subjects).where(and(eq(subjects.id, subjectId), user.role === 'STUDENT' ? eq(subjects.isVisible, true) : undefined as any)).limit(1);
  if (!subject) return NextResponse.json({ error: 'المادة غير موجودة.' }, { status: 404 });

  const rows = await db.select().from(pdfLibrary).where(eq(pdfLibrary.subjectId, subjectId)).orderBy(pdfLibrary.sortOrder);
  return NextResponse.json({ subject, pdfs: rows });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });

  const subjectId = Number(params.id);
  if (!Number.isInteger(subjectId) || subjectId < 1) return NextResponse.json({ error: 'معرف المادة غير صالح.' }, { status: 400 });

  const payload = subjectSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: payload.error.flatten().fieldErrors }, { status: 400 });

  const [updated] = await db.update(subjects)
    .set({
      name: payload.data.name,
      description: payload.data.description,
      icon: payload.data.icon,
      color: payload.data.color,
      isVisible: payload.data.isVisible,
      isActive: payload.data.isActive,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, subjectId))
    .returning();

  if (!updated) return NextResponse.json({ error: 'المادة غير موجودة.' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });

  const subjectId = Number(params.id);
  if (!Number.isInteger(subjectId) || subjectId < 1) return NextResponse.json({ error: 'معرف المادة غير صالح.' }, { status: 400 });

  const [deleted] = await db.delete(subjects).where(eq(subjects.id, subjectId)).returning({ id: subjects.id });
  if (!deleted) return NextResponse.json({ error: 'المادة غير موجودة.' }, { status: 404 });
  return NextResponse.json({ ok: true, id: deleted.id });
}
