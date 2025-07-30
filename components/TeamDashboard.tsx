"use client";
import { Prisma } from "@/app/generated/prisma";

type TeamWithMembers = Prisma.TeamGetPayload<{
  include: { members: { include: { user: true } } };
}>;

export default function TeamDashboard({ team }: { team: TeamWithMembers }) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/team/invite/${team.inviteCode}`;

  function copyInvite() {
    navigator.clipboard.writeText(inviteUrl);
    alert("Invite link copied!");
  }

  return (
    <div>
      <h1>{team.name}</h1>
      <button onClick={copyInvite}>Copy Invite Link</button>

      <h2>Members</h2>
      <ul>
        {team.members.map((m) => (
          <li key={m.id}>
            {m.user.firstName} {m.user.lastName} ({m.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
