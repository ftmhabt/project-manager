"use client";

import React, { useState, useTransition } from "react";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import { updateTaskStatus } from "@/app/actions/changeTaskStatus";
import ActionButton from "./ActionButton";

interface IsCheckedProps {
  projectId: string;
  task: Task;
}

export default function IsChecked({ task, projectId }: IsCheckedProps) {
  const [isChecked, setIsChecked] = useState(
    task.status === TASK_STATUS.COMPLETED
  );
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newStatus = isChecked
      ? TASK_STATUS.NOT_STARTED
      : TASK_STATUS.COMPLETED;

    setIsChecked(newStatus === TASK_STATUS.COMPLETED);

    startTransition(async () => {
      try {
        await updateTaskStatus({ id: task.id, projectId, status: newStatus });
      } catch (err) {
        setIsChecked(isChecked);
        console.error("Server action failed:", err);
      }
    });
  };

  return (
    <ActionButton
      id={task.id}
      label={isChecked ? "Checked" : "Check"}
      textColor="text-indigo-500"
      loaderColor="border-indigo-500"
      loading={isPending}
      onClick={handleToggle}
    />
  );
}
