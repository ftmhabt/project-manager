import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import ActiveTaskCalendar from "@/components/calendar/ActiveTaskCalendar";

const getData = async () => {
  const user = await getUserFromCookie();
  const tasks = await db.task.findMany({
    where: {
      ownerId: user?.id,
    },
  });

  return tasks;
};
export default async function page() {
  const tasks = await getData();
  return <ActiveTaskCalendar tasks={tasks} />;
}
