import GlassPane from "components/GlassPane";
import { getTeams } from "features/team/actions/getTeams";
import NewTeam from "features/team/components/NewTeam";
import TeamCard from "features/team/components/TeamCard";

export default async function page() {
  const { teams } = await getTeams();

  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-3 w-full">
      <div className="h-full items-stretch justify-center min-h-[content]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grow items-center flex-wrap flex-col sm:flex-row mt-3 -m-3">
          {teams &&
            teams.map((team) => (
              <div className="w-full p-3" key={team.id}>
                <TeamCard team={team} />
              </div>
            ))}
          <div className="w-full p-3 h-full">
            <GlassPane className="rounded-3xl w-full flex items-center justify-center h-full drop-shadow-xl">
              <NewTeam />
            </GlassPane>
          </div>
        </div>
      </div>
    </div>
  );
}
