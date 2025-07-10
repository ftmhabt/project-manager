import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import Card from "./Card";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import Newtask from "./NewTask";

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
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600"> {title || ""}</span>
        </div>
        <div>
          <Newtask projectId={projectId} />
        </div>
      </div>
      <div>
        {data && data.length ? (
          <div>
            {data.map((task) => (
              <div className="py-2" key={task.id}>
                <div>
                  <span className="text-3xl text-gray-600"> {task.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">
                    {" "}
                    {task.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>no tasks</div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
