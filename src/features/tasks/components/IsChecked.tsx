"use client";

import { Task } from "@prisma/client";
import { useState, useTransition } from "react";
import { updateTaskStatus } from "../actions/changeTaskStatus";
import ActionButton from "components/ActionButton";

export default function IsChecked({ task }: { task: Task }) {
  const [isChecked, setIsChecked] = useState(task.status === "COMPLETED");
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newStatus = isChecked ? "NOT_STARTED" : "COMPLETED";

    setIsChecked(newStatus === "COMPLETED");

    startTransition(async () => {
      try {
        await updateTaskStatus({
          id: task.id,
          projectId: task.projectId,
          status: newStatus,
        });
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
