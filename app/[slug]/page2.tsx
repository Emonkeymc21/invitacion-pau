import { notFound } from 'next/navigation';
import InviteClient from '@/components/InviteClient';
import { getInvitationBySlug } from '@/lib/invitations';
import { formatArgentinaReference } from '@/lib/time';

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invitation = getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  return (
    <InviteClient
      slug={slug}
      publicInvitation={{
        nombre: invitation.nombre,
        unlockAtArgentina: invitation.unlockAtArgentina,
        unlockAtArgentinaFormatted: formatArgentinaReference(invitation.unlockAtArgentina)
      }}
    />
  );
}
