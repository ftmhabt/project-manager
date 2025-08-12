import { getTeamByInviteCodeAction } from "@/app/features/team/actions/inviteTeam";
import Invite from "@/app/features/team/components/Invite";
import Card from "@/components/Card";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const team = await getTeamByInviteCodeAction(params.code);

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Invalid Invite Link
          </h2>
          <p className="text-gray-600">
            This invite link is either expired or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pr-3 md:pr-0 flex justify-center items-center">
      <Card className="p-6 sm:p-9 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You've been invited to join{" "}
          <span className="text-violet-500">{team.name}</span>
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Accept the invitation to start collaborating with your team.
        </p>

        <Invite inviteCode={params.code} />
      </Card>
    </div>
  );
}
