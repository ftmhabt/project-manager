import ActiveTaskCalendar from "@/components/calendar/ActiveTaskCalendar";
import { getUserTasks, TasksWithProject } from "@/app/actions/getUserTasks";

export default async function page() {
  const tasks: TasksWithProject = await getUserTasks();
  return <ActiveTaskCalendar tasks={tasks} />;
}
