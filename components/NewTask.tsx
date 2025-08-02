"use client";
import { useState, useEffect, useTransition, FormEvent } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import Input from "./Input";
import { createTask } from "@/app/actions/createTask";
import { getAllProjects } from "@/app/actions/getAllProjects";
import ModalWrapper from "./ModalWrapper";
import { TeamMember } from "@/app/generated/prisma";

Modal.setAppElement("#modal");

const NewTask = ({
  projectId,
  selectedDay,
  teamMembers,
}: {
  projectId?: string;
  selectedDay?: Date;
  teamMembers?: TeamMember[];
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(selectedDay || new Date());

  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!projectId) {
      startTransition(async () => {
        const projectsFromServer = await getAllProjects();
        setProjects(projectsFromServer);
      });
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedDay) {
      setStartDate(selectedDay);
    }
  }, [selectedDay]);

  const handleSubmit = async (e: FormEvent, closeModal: () => void) => {
    e.preventDefault();
    const finalProjectId = projectId || selectedProjectId;
    if (!finalProjectId) return alert("Please select a project");

    startTransition(async () => {
      try {
        await createTask({
          name,
          description,
          projectId: finalProjectId,
          due: startDate,
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
      className={` ${
        selectedDay
          ? "py-0 xlg:w-32 shrink-0 w-full"
          : "py-6 flex  items-center justify-center"
      } hover:scale-105 transition-all ease-in-out duration-200 `}
    >
      <ModalWrapper
        buttonLabel="+ New Task"
        buttonClassName={
          selectedDay ? "py-1 border-2 border-violet-500 text-sm w-full" : ""
        }
      >
        {(closeModal) => (
          <form
            className="flex items-center flex-col gap-3"
            onSubmit={(e) => handleSubmit(e, closeModal)}
          >
            {!projectId && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="border-2 border-gray-400 rounded-3xl px-4 py-2 w-60 text-black"
                disabled={isPending}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
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
              className="border-solid border-black/40 border-2 px-6 py-2 text-lg rounded-3xl text-black w-60"
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
                {teamMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.userId}
                  </option>
                ))}
              </select>
            )}
            <Button type="submit">Create</Button>
          </form>
        )}
      </ModalWrapper>
    </div>
  );
};

export default NewTask;
