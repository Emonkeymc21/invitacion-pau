import InviteClient from '@/components/InviteClient';
import { getInvitationBySlug, invitations } from '@/lib/invitations';
import { formatArgentinaReference } from '@/lib/time';

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Si busca un slug no registrado, carga 'pau-rodriguez'
  const invitation = getInvitationBySlug(slug) || invitations['pau-rodriguez'];

  return (
    <InviteClient
      slug={invitation.slug}
      publicInvitation={{
        nombre: invitation.nombre,
        nickname: invitation.nickname,
        unlockAtArgentina: invitation.unlockAtArgentina,
        unlockAtArgentinaFormatted: formatArgentinaReference(invitation.unlockAtArgentina)
      }}
    />
  );
}