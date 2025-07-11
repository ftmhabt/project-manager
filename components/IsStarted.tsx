"use client";

import React, { useState, useTransition } from "react";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import { updateTaskStatus } from "@/app/actions/changeTaskStatus";
import StatusToggle from "./StatusToggle";

interface IsStartedProps {
  projectId: string;
  task: Task;
}

export default function IsStarted({ task, projectId }: IsStartedProps) {
  const [isStarted, setIsStarted] = useState(
    task.status === TASK_STATUS.STARTED
  );
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newStatus = isStarted ? TASK_STATUS.NOT_STARTED : TASK_STATUS.STARTED;

    setIsStarted(newStatus === TASK_STATUS.STARTED);

    startTransition(async () => {
      try {
        await updateTaskStatus({ id: task.id, projectId, status: newStatus });
      } catch (err) {
        setIsStarted(isStarted);
        console.error("Server action failed:", err);
      }
    });
  };

  return (
    <StatusToggle
      id={task.id}
      label="Task Started"
      checked={isStarted}
      textColor="text-violet-500"
      loading={isPending}
      onChange={handleToggle}
      trueLabel="Started"
      falseLabel="Start"
    />
  );
}
