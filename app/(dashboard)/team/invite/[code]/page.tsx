import { getTeamByInviteCodeAction } from "@/app/features/team/actions/inviteTeam";
import Invite from "@/app/features/team/components/Invite";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const team = await getTeamByInviteCodeAction(params.code);

  if (!team) return <p>Invalid invite link.</p>;

  return (
    <div>
      {/* eslint-disable-next-line react/no-unescaped-entities*/}
      <h1>You've been invited to join {team.name}</h1>
      <Invite inviteCode={params.code} />
    </div>
  );
}
