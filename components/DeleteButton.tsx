"use client";

import { useTransition } from "react";
import { Task } from "@/app/generated/prisma";
import { deleteTask } from "@/app/actions/deleteTask";
import ActionButton from "./ActionButton";

interface DeleteButtonProps {
  projectId: string;
  task: Task;
}

export default function DeleteButton({ task, projectId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await deleteTask({ id: task.id, projectId });
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
      loading={isPending}
      onClick={handleClick}
    />
  );
}
