import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import Card from "./Card";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import Newtask from "./NewTask";
import IsStarted from "./IsStarted";
import IsChecked from "./IsChecked";
import DeleteButton from "./DeleteButton";
import EditTask from "./EditTask";
import GlassPane from "./GlassPane";
import { calculateDue, timeLeftUntil } from "@/lib/due";

const NUMBERS: number = 10;
const getData = async () => {
  const user = await getUserFromCookie();
  const tasks = await db.task.findMany({
    where: {
      ownerId: user?.id,
      NOT: {
        status: TASK_STATUS.COMPLETED,
        deleted: false,
      },
    },
    take: NUMBERS,
    orderBy: {
      due: "asc",
    },
  });

  return tasks;
};

const TaskCard = async ({
  title,
  tasks,
  projectId,
}: {
  title?: string;
  tasks?: Task[];
  projectId?: string;
}) => {
  const data = tasks || (await getData());

  const notStartedTasks = data.filter(
    (task) => task.status === TASK_STATUS.NOT_STARTED
  );
  const startedTasks = data.filter(
    (task) => task.status === TASK_STATUS.STARTED
  );
  const completedTasks = data.filter(
    (task) => task.status === TASK_STATUS.COMPLETED
  );

  const renderTaskGroup = (tasks: Task[], heading: string) => (
    <GlassPane className="mt-6 rounded-3xl">
      <div className={`text-xl font-semibold text-white p-3 px-8 mb-2 `}>
        {heading}
      </div>

      <Card className="flex justify-between flex-col gap-10">
        {tasks.length ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between md:flex-row flex-col gap-2  w-full"
            >
              <div className="py-2">
                <div>
                  <span className="text-2xl text-gray-700 ">{task.name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-gray-500">
                    {task.description}
                  </span>
                  <span className="text-sm text-gray-500">
                    {task.due && timeLeftUntil(task.due)}
                  </span>
                </div>
              </div>
              <GlassPane className="rounded-3xl flex md:gap-3 justify-end flex-wrap md:flex-nowrap sm:mb-0 mb-2">
                {task.status !== TASK_STATUS.COMPLETED && (
                  <IsStarted task={task} projectId={projectId || ""} />
                )}
                <IsChecked task={task} projectId={projectId || ""} />
                <EditTask task={task} projectId={projectId || ""} />
                <DeleteButton task={task} projectId={projectId || ""} />
              </GlassPane>
            </div>
          ))
        ) : (
          <div className="text-gray-400 italic">No tasks</div>
        )}
      </Card>
    </GlassPane>
  );

  return (
    <div className="relative">
      <Card className="flex justify-between items-center sticky z-10 left-0 top-0 w-full">
        <div>
          <span className="text-3xl text-gray-600">
            {title || `${NUMBERS} upcoming task${NUMBERS === 1 ? "" : "s"}`}
          </span>
        </div>
        <div>
          <Newtask projectId={projectId} />
        </div>
      </Card>
      {renderTaskGroup(notStartedTasks, "To Start")}
      {renderTaskGroup(startedTasks, "In Progress")}

      {title && renderTaskGroup(completedTasks, "Done")}
    </div>
  );
};

export default TaskCard;
