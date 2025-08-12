"use client";
import { FormEvent, useState, useTransition } from "react";
import Button from "../Button";
import Input from "../Input";
import { createNewProject } from "@/app/features/tasks/actions/createNewProject";
import ModalWrapper from "../ModalWrapper";

const NewProject = ({ teamId }: { teamId?: string }) => {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    closeModal: () => void
  ) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createNewProject(name, teamId);
      } catch (err) {
        console.error("Server action failed:", err);
      } finally {
        closeModal();
      }
    });
  };

  return (
    <div className="py-6 hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center">
      <ModalWrapper buttonLabel="New Project">
        {(closeModal) => (
          <>
            <h1 className="text-xl mb-5 text-black text-center">New Project</h1>
            <form
              className="flex items-center flex-col gap-3"
              onSubmit={(e) => handleSubmit(e, closeModal)}
            >
              <Input
                placeholder="project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button type="submit">
                {isPending ? (
                  <div
                    className={`h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent`}
                  />
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </>
        )}
      </ModalWrapper>
    </div>
  );
};

export default NewProject;
