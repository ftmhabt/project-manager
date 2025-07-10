"use client";
import { createNewTask } from "@/lib/api";
import { useState } from "react";
import Modal from "react-modal";
import Button from "./Button";
import Input from "./Input";

Modal.setAppElement("#modal");

const Newtask = ({ projectId }: { projectId?: string }) => {
  const [isModalOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNewTask({ name, description, projectId });
    closeModal();
  };

  return (
    <div className="px-6 py-6 hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center">
      <Button
        onClick={() => openModal()}
        intent="text"
        className="text-violet-600"
      >
        + New Task
      </Button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => closeModal()}
        overlayClassName="bg-[rgba(0,0,0,0.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-3/4 bg-white rounded-xl p-8"
      >
        <h1 className="text-xl mb-5">New Task</h1>
        <form className="flex items-center" onSubmit={handleSubmit}>
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
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Newtask;
