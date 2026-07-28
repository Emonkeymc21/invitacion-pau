import { NextRequest, NextResponse } from 'next/server';
import { getInvitationBySlug, validateInvitationPassword } from '@/lib/invitations';
import { buildPersonalizedPdf } from '@/lib/pdf';

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

  const pdf = await buildPersonalizedPdf(invitation.nombre);

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invitacion-${slug}.pdf"`
    }
  });
}
