"use client";
import { useEffect, useState, useTransition, FormEvent } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { getAllProjects } from "@/app/features/tasks/actions/getAllProjects";
import ModalWrapper from "../../../../components/ModalWrapper";
import { TeamMember, Task } from "@/app/generated/prisma";
import { saveTask } from "@/app/features/tasks/actions/saveTask";
import ActionButton from "../../../../components/ActionButton";

Modal.setAppElement("#modal");

interface TaskModalProps {
  task?: Task; // if present → edit mode
  projectId?: string;
  selectedDay?: Date;
  teamMembers?: TeamMember[];
  triggerLabel?: string; // optional custom button text
  triggerClassName?: string; // optional button styles
}

export default function TaskModal({
  task,
  projectId,
  selectedDay,
  teamMembers,
  triggerLabel,
  triggerClassName,
}: TaskModalProps) {
  const isEdit = !!task;

  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [startDate, setStartDate] = useState<Date>(
    task?.due ? new Date(task.due) : selectedDay || new Date()
  );
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    projectId || task?.projectId || ""
  );
  const [selectedMemberId, setSelectedMemberId] = useState(
    task?.assignedToId || ""
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!projectId && !task) {
      startTransition(async () => {
        const projectsFromServer = await getAllProjects();
        setProjects(projectsFromServer);
      });
    }
  }, [projectId, task]);

  const handleSubmit = async (e: FormEvent, closeModal: () => void) => {
    e.preventDefault();

    const finalProjectId = projectId || selectedProjectId;
    if (!finalProjectId) return alert("Please select a project");

    startTransition(async () => {
      try {
        await saveTask({
          id: isEdit ? task!.id : undefined,
          name,
          description,
          projectId: finalProjectId,
          due: startDate,
          assignedToId: selectedMemberId,
        });
      } catch (err) {
        console.error("Server action failed:", err);
      } finally {
        closeModal();
      }
    });
  };

  return (
    <div
      className={`${
        selectedDay
          ? "py-0 xlg:w-32 shrink-0 w-full"
          : "py-6 flex items-center justify-center"
      }`}
    >
      <ModalWrapper
        buttonLabel={triggerLabel || (isEdit ? "Edit Task" : "+ New Task")}
        buttonClassName={triggerClassName || ""}
        triggerButton={
          isEdit && (
            <ActionButton
              id={task?.id || "<NEW>"}
              label="Edit"
              textColor="text-fuchsia-500"
              loaderColor="border-fuchsia-500"
              loading={false}
            />
          )
        }
      >
        {(closeModal) => (
          <form
            className="flex flex-col items-center gap-3"
            onSubmit={(e) => handleSubmit(e, closeModal)}
          >
            {!projectId && !task && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="border-2 border-gray-400 rounded-3xl px-4 py-2 w-60 text-black"
                disabled={isPending}
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            <Input
              placeholder="task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <DatePicker
              className="border border-black/40 px-6 py-2 text-lg rounded-3xl text-black w-60"
              selected={startDate}
              onChange={(date) => setStartDate(date!)}
              showTimeSelect
              dateFormat="Pp"
            />

            {teamMembers && teamMembers.length > 0 && (
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="border-2 border-gray-400 rounded-3xl px-4 py-2 w-60 text-black"
                disabled={isPending}
              >
                <option value="">Assign to member</option>
                {teamMembers.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.userId}
                  </option>
                ))}
              </select>
            )}

            <Button type="submit">
              {isEdit ? "Update Task" : "Create Task"}
            </Button>
          </form>
        )}
      </ModalWrapper>
    </div>
  );
}
