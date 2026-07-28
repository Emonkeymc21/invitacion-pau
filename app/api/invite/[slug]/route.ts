import { NextRequest, NextResponse } from 'next/server';
import { getInvitationBySlug, invitationContent, validateInvitationPassword } from '@/lib/invitations';
import { formatArgentinaDate } from '@/lib/time';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const invitation = getInvitationBySlug(slug);

  if (!invitation) {
    return NextResponse.json({ message: 'Invitación no encontrada.' }, { status: 404 });
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim() ?? '';

  if (!validateInvitationPassword(slug, password)) {
    return NextResponse.json({ message: 'La contraseña es incorrecta.' }, { status: 401 });
  }

  return NextResponse.json({
    invitation: {
      slug: invitation.slug,
      nombre: invitation.nombre,
      title: invitation.title,
      verse: invitation.verse,
      verseRef: invitation.verseRef,
      unlockAtArgentina: invitation.unlockAtArgentina,
      unlockAtArgentinaFormatted: formatArgentinaDate(invitation.unlockAtArgentina),
      meetUrl: invitation.meetUrl
    },
    content: invitationContent
  });
}
