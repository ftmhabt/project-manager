import ActiveTaskCalendar from "features/calendar/components/ActiveTaskCalendar";
import {
  getUserTasks,
  TasksWithProject,
} from "features/tasks/actions/getUserTasks";

export default async function page() {
  const tasks: TasksWithProject = await getUserTasks();
  return <ActiveTaskCalendar tasks={tasks} />;
}
