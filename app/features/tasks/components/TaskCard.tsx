import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import Card from "@/components/Card";
import { Task, User, TASK_STATUS, TeamMember } from "@/app/generated/prisma";
import IsStarted from "./IsStarted";
import IsChecked from "./IsChecked";
import DeleteButton from "./DeleteButton";
import GlassPane from "@/components/GlassPane";
import { timeLeftUntil } from "@/lib/due";
import TaskModal from "./TaskModal";
import { getPriortyTasks } from "../actions/getAllProjects";

export type TaskWithOptionalAssigned = Task & {
  assignedTo?: Pick<User, "id" | "firstName" | "lastName"> | null;
};

const TaskCard = async ({
  numbers,
  title,
  tasks,
  projectId,
  teamMembers,
  teamOwnerId,
}: {
  numbers?: number;
  title?: string;
  tasks?: TaskWithOptionalAssigned[];
  projectId?: string;
  teamMembers?: TeamMember[];
  teamOwnerId?: string;
}) => {
  const data = tasks || (await getPriortyTasks(numbers || 10));

  const notStartedTasks = data.filter(
    (task) => task.status === TASK_STATUS.NOT_STARTED
  );
  const startedTasks = data.filter(
    (task) => task.status === TASK_STATUS.STARTED
  );
  const completedTasks = data.filter(
    (task) => task.status === TASK_STATUS.COMPLETED
  );

  const currentUserId = await getUserFromCookie();
  const renderTaskGroup = (
    tasks: TaskWithOptionalAssigned[],
    heading: string
  ) => (
    <GlassPane className="mt-6 rounded-3xl">
      <div className={`text-xl font-semibold text-white p-3 px-8 mb-2 `}>
        {heading}
      </div>

      <Card className="flex justify-between flex-col gap-10">
        {tasks.length ? (
          tasks.map((task) => {
            const canEdit =
              currentUserId?.id === task.ownerId ||
              currentUserId?.id === task.assignedTo?.id ||
              currentUserId?.id === teamOwnerId;

            return (
              <div
                key={task.id}
                className="flex md:flex-row flex-col gap-2 w-full"
              >
                <div className="py-2 w-full">
                  <div>
                    <span className="text-2xl text-gray-700 ">{task.name}</span>
                    {task.assignedTo && (
                      <span className="text-sm border border-violet-500 bg-violet-100 px-2 ml-2 text-violet-500 rounded">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-gray-500">
                      {task.description}
                    </span>
                    <span className="text-sm text-gray-500 justify-self-end md:justify-self-auto">
                      {task.due && timeLeftUntil(task.due)}
                    </span>
                  </div>
                </div>

                <GlassPane
                  className={`rounded-3xl flex md:gap-3 justify-end flex-wrap md:flex-nowrap sm:mb-0 mb-2 ${
                    !canEdit ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {task.status !== TASK_STATUS.COMPLETED && (
                    <IsStarted task={task} />
                  )}
                  <IsChecked task={task} />
                  <TaskModal
                    task={task}
                    triggerLabel="Edit"
                    triggerClassName="text-fuchsia-500 border-fuchsia-500"
                  />
                  <DeleteButton task={task} />
                </GlassPane>
              </div>
            );
          })
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
            {title || `upcoming tasks`}
          </span>
        </div>
        <div>
          <TaskModal projectId={projectId} teamMembers={teamMembers} />
        </div>
      </Card>
      {renderTaskGroup(notStartedTasks, "To Start")}
      {renderTaskGroup(startedTasks, "In Progress")}

      {title && renderTaskGroup(completedTasks, "Done")}
    </div>
  );
};

export default TaskCard;
