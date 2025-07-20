"use client";
import { FormEvent, useState } from "react";
import Modal from "react-modal";
import ActionButton from "./ActionButton";
import Input from "./Input";
import Button from "./Button";
import { updateTask } from "@/app/actions/updateTask";
import { Task } from "@/app/generated/prisma";

Modal.setAppElement("#modal");

const EditTask = ({ task }: { task: Task }) => {
  const [isModalOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateTask({
      id: task.id,
      name,
      description,
      projectId: task.projectId,
    });
    closeModal();
  };

  return (
    <>
      <ActionButton
        id={task.id}
        label="Edit"
        textColor="text-fuchsia-500"
        loaderColor="border-fuchsia-500"
        loading={false}
        onClick={() => openModal()}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => closeModal()}
        overlayClassName="bg-[rgba(0,0,0,0.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-3/4 bg-white rounded-xl p-8"
      >
        <form
          className="flex items-center flex-col sm:flex-row gap-3"
          onSubmit={handleSubmit}
        >
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
          <Button type="submit">Update</Button>
        </form>
      </Modal>
    </>
  );
};

export default EditTask;
