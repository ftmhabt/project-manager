"use client";

import { useState, useTransition } from "react";
import { updateTaskStatus } from "../actions/changeTaskStatus";
import ActionButton from "components/ActionButton";
import { Task } from "@prisma/client";

export default function IsStarted({ task }: { task: Task }) {
  const [isStarted, setIsStarted] = useState(task.status === "STARTED");
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newStatus = isStarted ? "NOT_STARTED" : "STARTED";

    setIsStarted(newStatus === "STARTED");

    startTransition(async () => {
      try {
        await updateTaskStatus({
          id: task.id,
          projectId: task.projectId,
          status: newStatus,
        });
      } catch (err) {
        setIsStarted(isStarted);
        console.error("Server action failed:", err);
      }
    });
  };

  return (
    <ActionButton
      id={task.id}
      label={isStarted ? "Started" : "Start"}
      textColor="text-violet-500"
      loaderColor="border-violet-500"
      loading={isPending}
      onClick={handleToggle}
    />
  );
}
