"use client";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import { changeTaskStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function IsStarted({
  task,
  projectId,
}: {
  task: Task;
  projectId: string;
}) {
  const [started, setIsStarted] = useState(task.status === TASK_STATUS.STARTED);
  const router = useRouter();
  const handleChange = () => {
    setIsStarted((prev) => !prev);
    if (task.status === TASK_STATUS.STARTED)
      changeTaskStatus({
        id: task.id,
        status: TASK_STATUS.NOT_STARTED,
        projectId,
      });
    if (task.status === TASK_STATUS.NOT_STARTED)
      changeTaskStatus({
        id: task.id,
        status: TASK_STATUS.STARTED,
        projectId,
      });
    router.refresh();
  };

  return (
    <input
      type="checkbox"
      name="status"
      id={task.id}
      checked={started}
      onChange={handleChange}
    />
  );
}
