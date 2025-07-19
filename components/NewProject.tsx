"use client";
import { FormEvent, useState, useTransition } from "react";
import Modal from "react-modal";
import Button from "./Button";
import Input from "./Input";
import { createNewProject } from "@/app/actions/createNewProject";

Modal.setAppElement("#modal");

const NewProject = () => {
  const [isModalOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createNewProject(name);
      } catch (err) {
        console.error("Server action failed:", err);
      } finally {
        closeModal();
      }
    });
  };

  return (
    <div className="py-6 hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center">
      <Button onClick={() => openModal()}>New Project</Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => closeModal()}
        overlayClassName="bg-[rgba(0,0,0,0.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-72 bg-white rounded-xl p-6 sm:p-8"
      >
        <h1 className="text-xl mb-5 text-black text-center">New Project</h1>
        <form
          className="flex items-center flex-col gap-3"
          onSubmit={handleSubmit}
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
      </Modal>
    </div>
  );
};

export default NewProject;
