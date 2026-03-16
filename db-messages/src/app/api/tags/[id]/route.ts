import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

async function findContact(contactId: string) {
  return prisma.contact.findFirst({
    where: {
      OR: [{ id: contactId }, { identity: contactId }],
    },
    select: { id: true },
  });
}

export async function GET(_: NextRequest, { params }: Params) {
  const { id: contactId } = await params;

  const contact = await findContact(contactId);

  if (!contact) {
    return NextResponse.json(
      { error: "Não foi encontrado o contato selecionado." },
      { status: 404 },
    );
  }

  const tags = await prisma.tag.findMany({
    where: {
      contacts: {
        some: { contactId: contact.id },
      },
    },
  });

  return NextResponse.json(tags, { status: 200 });
}

const patchSchema = z.object({
  color: z.string().nullable(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id: tagId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const tag = await prisma.tag.update({
    where: { id: tagId },
    data: { color: parsed.data.color },
  });

  return NextResponse.json(tag, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id: contactId } = await params;

  let tagIds: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.tagIds)) {
      tagIds = (body.tagIds as unknown[]).filter(
        (id): id is string => typeof id === "string",
      );
    }
  } catch {
    /* empty body → empty tagIds */
  }

  const contact = await findContact(contactId);

  if (!contact) {
    return NextResponse.json(
      { error: "Não foi encontrado o contato selecionado." },
      { status: 404 },
    );
  }

  await prisma.$transaction([
    prisma.contactTag.deleteMany({ where: { contactId: contact.id } }),
    ...(tagIds.length > 0
      ? [
          prisma.contactTag.createMany({
            data: tagIds.map((tagId) => ({ contactId: contact.id, tagId })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  const tags = await prisma.tag.findMany({
    where: { contacts: { some: { contactId: contact.id } } },
  });

  return NextResponse.json(tags, { status: 200 });
}
