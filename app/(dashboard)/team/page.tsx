import { db } from "@/lib/db";
import NewTeam from "@/components/NewTeam";
import Link from "next/link";
import TeamCard from "@/components/TeamCard";

export const getData = async () => {
  const teams = await db.team.findMany();
  return { teams };
};

export default async function page() {
  const { teams } = await getData();

  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-3 w-full">
      <div className="h-full items-stretch justify-center min-h-[content]">
        <div className="flex flex-2 grow items-center flex-wrap flex-col sm:flex-row mt-3 -m-3">
          {teams &&
            teams.map((team) => (
              <div className="sm:w-1/3 w-full p-3" key={team.id}>
                <Link href={`/team/${team.id}`}>
                  <TeamCard team={team} />
                </Link>
              </div>
            ))}
          <div className="w-1/3 p-3">
            <NewTeam />
          </div>
        </div>
      </div>
    </div>
  );
}
