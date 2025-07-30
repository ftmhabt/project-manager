import TeamDashboard from "@/app/features/team/components/TeamDashboard";
import { db } from "@/lib/db";

export default async function TeamPage({ params }: { params: { id: string } }) {
  const team = await db.team.findUnique({
    where: { id: params.id },
    include: {
      members: { include: { user: true } },
      projects: { include: { tasks: true } },
    },
  });

  if (!team) {
    return <p>Team not found.</p>;
  }

  return <TeamDashboard team={team} />;
}
