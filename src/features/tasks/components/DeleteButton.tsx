"use client";

import { useTransition } from "react";
import { deleteTask } from "../actions/deleteTask";
import ActionButton from "components/ActionButton";
import { Task } from "@prisma/client";

export default function DeleteButton({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await deleteTask({
          id: task.id,
          projectId: task.projectId,
        });
      } catch (err) {
        console.error("Server action failed:", err);
      }
    });
  };

  return (
    <ActionButton
      id={task.id}
      label="Delete"
      textColor="text-pink-500"
      loaderColor="border-pink-500"
      loading={isPending}
      onClick={handleClick}
    />
  );
}
