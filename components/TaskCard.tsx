import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import Card from "./Card";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import Newtask from "./NewTask";
import IsStarted from "./IsStarted";
import IsChecked from "./IsChecked";

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
    take: 5,
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

  const renderTaskGroup = (tasks: Task[], heading: string, color: string) => (
    <div className="mt-6">
      <h3 className={`text-xl font-semibold ${color} mb-2`}>{heading}</h3>
      {tasks.length ? (
        tasks.map((task) => (
          <div key={task.id} className="flex justify-between">
            <div className="py-2">
              <div>
                <span className="text-2xl text-gray-700 ">{task.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  {task.description}
                </span>
              </div>
            </div>
            <div className="flex justify-around">
              {task.status !== TASK_STATUS.COMPLETED && (
                <IsStarted task={task} projectId={projectId || ""} />
              )}
              {task.status !== TASK_STATUS.NOT_STARTED && (
                <IsChecked task={task} projectId={projectId || ""} />
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-400 italic">No tasks</div>
      )}
    </div>
  );

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">{title || ""}</span>
        </div>
        <div>
          <Newtask projectId={projectId} />
        </div>
      </div>

      {renderTaskGroup(notStartedTasks, "To Start", "text-red-600")}
      {renderTaskGroup(startedTasks, "In Progress", "text-yellow-600")}
      {renderTaskGroup(completedTasks, "Done", "text-green-600")}
    </Card>
  );
};

export default TaskCard;
