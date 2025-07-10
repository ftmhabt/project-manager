"use client";

import React, { useState, useTransition } from "react";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import { updateTaskStatus } from "@/app/actions/changeTaskStatus";

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
      loading={isPending}
      onChange={handleToggle}
    />
  );
}

interface StatusToggleProps {
  id: string;
  label: string;
  checked: boolean;
  loading?: boolean;
  onChange: () => void;
}

function StatusToggle({
  id,
  label,
  checked,
  loading = false,
  onChange,
}: StatusToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      ) : (
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 cursor-pointer"
        />
      )}
      <label htmlFor={id} className={`text-sm ${loading ? "opacity-50" : ""}`}>
        {label}
      </label>
    </div>
  );
}
