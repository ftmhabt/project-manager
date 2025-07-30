import {
  getTeamByInviteCodeAction,
  joinTeamAction,
} from "@/app/actions/inviteTeam";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const team = await getTeamByInviteCodeAction(params.code);

  if (!team) return <p>Invalid invite link.</p>;

  async function handleJoin() {
    "use server";
    try {
      await joinTeamAction(params.code);
    } catch (error) {
      console.error("Error joining team:", error);
    }

    // Optionally redirect after join
  }

  return (
    <div>
      <h1>You've been invited to join {team.name}</h1>
      <form action={handleJoin}>
        <button type="submit">Accept Invite</button>
      </form>
    </div>
  );
}
